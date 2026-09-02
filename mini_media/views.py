from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import logout,authenticate,login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from .models import *
from .form import *
from .decorators import *

# Create your views here.
def RegisterPage(request):
    form=RegisterForm()
    if request.method=='POST':
        form=RegisterForm(request.POST)
        if form.is_valid():
            user=form.save(commit=True)
            profile.objects.create(user=user)
            #username=form.cleaned_data.get('username')
            return redirect('LoginPage')
            
    context={'form':form}
    return render(request,'mini_media/register.html', context)


def LoginPage(request):
    if request.method=='POST':
        username=request.POST.get('username')
        password=request.POST.get('password')
        user=authenticate(request, username=username,password=password)
        if user is not None:
            login(request,user)
            if user.is_staff:
                return redirect('dashboard')
            else:
                return redirect('UserPage')
    context={}
    return render(request,'mini_media/login.html', context)
@login_required
def UserPage(request):
    posts = post.objects.all().order_by('-created_at')

    context = {
        'posts': posts,
    }

    return render(
        request,
        'mini_media/user_home.html',
        context
    )
@login_required
def AdminDashboard(request):
    if not request.user.is_staff:
        return redirect('UserPage')

    return render(request, 'mini_media/dashboard.html')
@login_required
def TrendingPage(request):
    period=request.GET.get('period','all')
    now=timezone.now()
    if period=='today':
        start_date=now.replace(
            hour=0,
            minute=0,
            second=0,
            microsecond=0
        )
    elif period=='week':
        start_date=now-timedelta(days=7)
    elif period=='month':
        start_date=now-timedelta(days=30)
    else:
        start_date=None
    if start_date:
        trending_posts=post.objects.annotate(
            like_count=Count('likes',
                             filter=Q(likes__created_at__gte=start_date))
        ).filter(
            like_count__gt=0
        ).order_by('-like_count')
    else:
        trending_posts=post.objects.annotate(
            like_count=Count('likes')
        ).filter(like_count__gt=0).order_by('-like_count')
    context={'trending_posts':trending_posts,
             'period':period,}

    return render(request,'mini_media/trending.html',context)

@login_required
def Like_Post(request, post_id):

    selected_post = get_object_or_404(
        post,
        id=post_id
    )

    like, created = PostLike.objects.get_or_create(
        user=request.user,
        posts=selected_post
    )

    if created:

        liked = True

    else:

        like.delete()

        liked = False

    return JsonResponse({
        'liked': liked,
        'likes_count': selected_post.likes.count()
    })

@login_required
def Comment_Post(request, post_id):

    selected_post = get_object_or_404(post, id=post_id)

    if request.method == 'POST':

        text = request.POST.get('comment', '').strip()

        if text:

            new_comment = Comment.objects.create(
                user=request.user,
                posts=selected_post,
                text=text
            )

            return JsonResponse({
                'success': True,
                'comment': {
                    'user': new_comment.user.username,
                    'text': new_comment.text,
                }
            })

    return JsonResponse({
        'success': False,
        'error': 'Comment cannot be empty.'
    }, status=400)

@login_required
def Save_Post(request, post_id):
    selected_post=get_object_or_404(post,id=post_id)
    saved=SavedPost.objects.filter(
        user=request.user,
        posts=selected_post
    )
    if saved.exists():
        saved.delete()
        is_saved = False
    else:
        SavedPost.objects.create(
            user=request.user,
            posts=selected_post
        )
        is_saved = True
    return JsonResponse({'saved': is_saved})
@login_required
def UserProfile(request):

    user_profile, created = profile.objects.get_or_create(
        user=request.user
    )

    if request.method == 'POST':

        user_form = UserUpdateForm(
            request.POST,
            instance=request.user
        )

        profile_form = ProfileForm(
            request.POST,
            request.FILES,
            instance=user_profile
        )

        if user_form.is_valid() and profile_form.is_valid():

            user_form.save()
            profile_form.save()

            return redirect('UserProfile')

    else:

        user_form = UserUpdateForm(
            instance=request.user
        )

        profile_form = ProfileForm(
            instance=user_profile
        )

    posts = post.objects.filter(
        user=request.user
    ).order_by('-created_at')

    context = {
        'profile': user_profile,
        'posts': posts,
        'user_form': user_form,
        'form': profile_form,
    }

    return render(
        request,
        'mini_media/profile.html',
        context
    )

def LogoutUser(request):
    logout(request)
    return redirect('LoginPage')
@admin_required
def dashboard(request):
    all_posts=post.objects.all()
    posts=post.objects.all().order_by('-created_at')[:3]
    total_posts=all_posts.count()
    context={'posts':posts, 'total_posts':total_posts,}
    return render(request,'mini_media/dashboard.html', context)

def create_post(request):
    if request.method == 'POST':
        image = request.FILES.get('image')
        description = request.POST.get('description', '').strip()
        if image:
            post.objects.create(user=request.user, image=image, description=description)
            return redirect('dashboard')

    return render(request,'mini_media/create_post.html')
def all_post(request):
    posts=post.objects.all().order_by('-created_at')
    context={'posts':posts}
    return render(request,'mini_media/all_post.html', context)

def delete_post(request,post_id):
    if request.method=='POST':
        selected_post=post_object=get_object_or_404(post, id=post_id)
        selected_post.delete()
        next_page=request.POST.get('next')
        if next_page=='all_post':
            return redirect('all_post')
        return redirect('dashboard')
    return redirect('dashboard')
def update_post(request,post_id):
    selected_post=get_object_or_404(post,id=post_id)
    if request.method=='POST':
        image=request.FILES.get('image')
        description=request.POST.get('description', '').strip()
        if image:
            selected_post.image=image
        selected_post.description=description
        selected_post.save()
        return redirect('dashboard')
    context={'post':selected_post}
    return render(request, 'mini_media/create_post.html', context)