from django.contrib import admin
from .models import profile, post, PostLike, Comment, SavedPost

admin.site.register(profile)
admin.site.register(post)
admin.site.register(PostLike)
admin.site.register(Comment)
admin.site.register(SavedPost)