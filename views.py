from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.core.paginator import Paginator
from django.views.decorators.csrf import csrf_exempt
import json

from .models import *
from .forms import *

def all_posts(request, page=1):
    if request.method == "POST":
        page = int(page)
        pages = Paginator(Post.objects.all().order_by("-timestamp"), 10)
        pageCount = pages.num_pages
        serialised_posts_array = []
        for post in pages.page(page).object_list:
            serialised_post_dict = post.serialise()
            if request.user.is_authenticated:
                serialised_post_dict["liked"] = post.liked_by_user(request.user)
            if request.user == post.user:
                serialised_post_dict["belongsToUser"] = True
            else:
                serialised_post_dict["belongsToUser"] = False
            serialised_posts_array.append(serialised_post_dict)
        return JsonResponse({
            "posts": serialised_posts_array,
            "pageCount": pageCount
            }, safe=False)
    else:
        return render(request, "network/layout.html", {
            "form": NewPost()
        })

@login_required
def profile(request, username):
    if request.method == "POST":
        user = User.objects.get(username=username)
        serialisedUser = user.serialise()
        return JsonResponse({
            "user": serialisedUser
        })
    return render(request, "network/layout.html", {
        "form": NewPost()
    })

@login_required
def like_post(request, postID):
    if request.method == "POST":
        post = Post.objects.get(pk = postID)
        try:
            print("deleting like from post", post.pk)
            like = Like.objects.get(post = post, user = request.user)
            like.delete()
        except ObjectDoesNotExist:
            print("adding like to post", post.pk)
            like = Like(user = request.user, post = post)
            like.save()
        post_likes = len(Like.objects.filter(post = post))
        post_liked = post.liked_by_user(request.user)
        return JsonResponse({
            "likes": post_likes,
            "liked": post_liked
        })


@login_required
def new_post(request):
    if request.method == "POST":
        form = NewPost(request.POST)
        if form.is_valid():
            post = Post(content = form.cleaned_data["content"], user = request.user)
            post.save()
            return HttpResponseRedirect(reverse("index"))

@login_required
def edit_post(request, post_id):
    if request.method == "POST":
        post = Post.objects.get(pk=post_id, user=request.user)
        content = json.loads(request.body)["content"]
        post.content = content
        post.save()
        return JsonResponse({
            "success": True
        })

@login_required
def delete_post(request, post_id):
    if request.method == "POST":
        post = Post.objects.get(pk=post_id, user=request.user)
        post.delete()
        return JsonResponse({
            "success": True
        })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
