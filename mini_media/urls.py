from django.urls import path
from . import views



urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('create_post/', views.create_post, name='create_post'),
    path('delete_post/<int:post_id>/', views.delete_post, name='delete_post'),
    path('all_post/', views.all_post, name='all_post'),
    path('update_post/<int:post_id>/', views.update_post, name='update_post'),
    path('RegisterPage/', views.RegisterPage, name='RegisterPage'),
    path('LoginPage/', views.LoginPage, name='LoginPage'),
    path('UserPage/', views.UserPage, name='UserPage'),
    path('UserProfile/', views.UserProfile, name='UserProfile'),
    path('LogoutUser/', views.LogoutUser, name='LogoutUser'),
    path('like/<int:post_id>/', views.Like_Post, name='Like_Post'),
    path('comment/<int:post_id>/', views.Comment_Post, name='Comment_Post'),
    path('save/<int:post_id>/', views.Save_Post, name='Save_Post'),
]
