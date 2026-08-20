from django.forms import ModelForm
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import *

class RegisterForm(UserCreationForm):

    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

class ProfileForm(forms.ModelForm):
    class Meta:
        model =profile
        fields = ['real_name', 'profile_image', 'bio']
class UserUpdateForm(forms.ModelForm):

    class Meta:
        model = User
        fields = ['username']