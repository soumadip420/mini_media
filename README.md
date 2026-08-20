# Mini Media

Mini Media is a Django-based social media web application where users can create posts, manage their profiles, and interact with other users' posts.

The project includes features such as user authentication, profile management, post creation, likes, comments, saving posts, and post management.

## Features

### User Authentication
- User registration
- User login
- User logout
- Authentication-protected pages
- Separate access for regular users and administrators

### User Profile
- View user profile
- Edit profile information
- Add or update profile picture
- Add real name
- Add profile bio
- Display user's posts
- Display total number of posts

### Posts
- Create posts
- Upload images with posts
- Add post descriptions
- View all posts
- View user's own posts
- Update posts
- Delete posts
- Display post creation time

### Post Interactions
- Like posts
- Unlike posts
- Comment on posts
- View comments
- Save posts
- Download post images
- Share posts

### Feed
- Display posts from users
- Display post author's username
- Display author's profile picture
- Display relative post time
- Like and save posts without leaving the feed
- Open comments directly from the feed

### Admin
- Admin dashboard
- View posts
- View total number of posts
- Manage posts

## Technologies Used

- Python
- Django
- SQLite
- HTML
- CSS
- JavaScript
- Django Templates

## Project Structure

```text
mini-media/
│
├── manage.py
├── .gitignore
├── README.md
│
├── mini_media/
│   ├── migrations/
│   ├── templates/
│   ├── static/
│   ├── models.py
│   ├── views.py
│   ├── forms.py
│   ├── urls.py
│   └── ...
│
├── static/
│   ├── css/
│   ├── js/
│   └── images/
│
└── media/
    ├── posts/
    └── profile/