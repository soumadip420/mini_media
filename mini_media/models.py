from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout

# Create your models here.
class profile(models.Model):
    user=models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    real_name=models.CharField(max_length=100, blank=True)
    profile_image=models.ImageField(upload_to="profile/", null=True)
    bio=models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.user.username
class post(models.Model):
    user=models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='posts'
    )
    image=models.ImageField(upload_to='posts/')
    description=models.CharField(max_length=200)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.description
class PostLike(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    posts=models.ForeignKey(post,on_delete=models.CASCADE, related_name='likes')
    created_at=models.DateTimeField(auto_now_add=True)
    class meta:
        constraints=[
            models.UniqueConstraint(
                fields=['user','posts'],
                name='unique_user_post_like'
            )
        ]
    def __str__(self):
        return f"{self.user.username}-liked post{self.post.id}"
    
class Comment(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    posts=models.ForeignKey(post,on_delete=models.CASCADE, related_name='comments')
    text=models.CharField(max_length=200)
    created_at=models.DateTimeField(auto_now_add=True)
    def __str__(self):
            return f"{self.user.username}-{self.post.id}"

class SavedPost(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    posts=models.ForeignKey(post,on_delete=models.CASCADE, related_name='saved_by')
    created_at=models.DateTimeField(auto_now_add=True)
    class meta:
        constraints=[
            models.UniqueConstraint(
                fields=['user','posts'],
                name='unique_saved_post'
            )
        ]
    def __str__(self):
        return f"{self.user.username}-saved post{self.post.id}"


