from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ObjectDoesNotExist
import datetime

class User(AbstractUser):
    followers = models.ManyToManyField("self", related_name="following", symmetrical=False)
    # ? Maybe add more attributes to users
    def serialise(self):

        serialisedFollowers = []
        for follower in self.followers.values():
            serialisedFollowers.append({"username": follower["username"]})

        serialisedFollowing = []
        for following in self.following.values():
            serialisedFollowing.append({"username": following["username"]})

        return {
            "username": self.username,
            "email": self.email,
            "followers": serialisedFollowers,
            "following": serialisedFollowing
        }

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.CharField(max_length=256)
    timestamp = models.DateTimeField(auto_now_add=True)

    def liked_by_user(self, user):
        try:
            if Like.objects.get(user = user, post = self.pk):
                return True
        except ObjectDoesNotExist:
            return False

    def serialise(self):
        if len(self.likes.values()) > 0:
            likes = len(self.likes.values())
        else:
            likes = 0

        if self.timestamp.date() == datetime.date.today():
            timestampSerialised = self.timestamp.strftime("%H:%M")
        else:
            timestampSerialised = self.timestamp.strftime(" %I:%M %p. %a, %d %b.")

        return {
            "pk": self.pk,
            "user": self.user.username,
            "content": self.content,
            "timestamp": timestampSerialised,
            "likes": likes
        }

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="likes")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes")

    def serialise(self):
        return {
            "user": self.user.username,
            "post": self.post.pk
        }