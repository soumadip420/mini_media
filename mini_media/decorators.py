from django.shortcuts import redirect
def admin_required(view_func):
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('LoginPage')
        if not request.user.is_staff:
            return redirect('UserPage')
        return view_func(request,*args, **kwargs)
    return wrapper