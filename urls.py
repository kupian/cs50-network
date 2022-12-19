
from django.urls import path

from . import views

urlpatterns = [
    path("", views.all_posts, name="index"),
    path("<int:page>", views.all_posts, name="all_posts_page"),
    path("like/<int:postID>", views.like_post, name="like"),
    path("edit/<int:post_id>", views.edit_post, name="edit"),
    path("delete/<int:post_id>", views.delete_post, name="delete"),
    path("profile/<str:username>", views.profile, name="profile"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("new", views.new_post, name="new_post")
]
