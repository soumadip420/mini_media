// ============================================================
// THREE-DOT MENU
// ============================================================

function toggleMenu(btn) {

    const dropdown = btn.nextElementSibling;

    if (!dropdown) return;

    const isOpen = dropdown.classList.contains('open');

    // Close all menus
    document.querySelectorAll('.menu-dropdown.open').forEach(menu => {
        menu.classList.remove('open');
    });

    // Open selected menu
    if (!isOpen) {
        dropdown.classList.add('open');
    }
}


// Close menu when clicking outside
document.addEventListener('click', function (e) {

    if (!e.target.closest('.menu-wrap')) {

        document.querySelectorAll('.menu-dropdown.open').forEach(menu => {
            menu.classList.remove('open');
        });

    }

});


// ============================================================
// LIKE BUTTON
// ============================================================

document.querySelectorAll('.like-form').forEach(form => {

    const button = form.querySelector('.like-btn');

    if (!button) return;

    button.addEventListener('click', function (e) {

        e.preventDefault();

        const postId = button.dataset.postId;

        const csrfInput = form.querySelector(
            '[name="csrfmiddlewaretoken"]'
        );

        if (!csrfInput) {
            console.error('CSRF token not found.');
            return;
        }

        const csrfToken = csrfInput.value;

        // Prevent double clicks
        if (button.dataset.loading === 'true') {
            return;
        }

        button.dataset.loading = 'true';

        fetch(form.action, {
            method: 'POST',

            headers: {
                'X-CSRFToken': csrfToken,
                'X-Requested-With': 'XMLHttpRequest'
            }
        })

        .then(async response => {

            const text = await response.text();

            if (!response.ok) {
                throw new Error(
                    'Server returned ' + response.status + ': ' + text
                );
            }

            // Try to convert response into JSON
            try {
                return JSON.parse(text);
            } catch (error) {
                throw new Error(
                    'Like view did not return JSON. Server returned: ' + text
                );
            }

        })

        .then(data => {

            console.log('Like response:', data);

            const wrapper = document.getElementById(
                'post-wrapper-' + postId
            );

            if (!wrapper) return;

            // -------------------------
            // Update heart
            // -------------------------

            if (data.liked === true) {

                button.classList.add('liked');

            } else if (data.liked === false) {

                button.classList.remove('liked');

            }


            // -------------------------
            // Update like count
            // -------------------------

            const likesCount = wrapper.querySelector(
                '.likes-count'
            );

            if (likesCount && data.likes_count !== undefined) {

                likesCount.textContent =
                    data.likes_count + ' likes';

            }

        })

        .catch(error => {

            console.error('Like error:', error);

        })

        .finally(() => {

            button.dataset.loading = 'false';

        });

    });

});


// ============================================================
// SAVE BUTTON
// ============================================================

document.querySelectorAll('.save-form').forEach(form => {

    const button = form.querySelector('.save-btn');

    if (!button) return;

    button.addEventListener('click', function (e) {

        e.preventDefault();

        const csrfInput = form.querySelector(
            '[name="csrfmiddlewaretoken"]'
        );

        if (!csrfInput) {
            console.error('CSRF token not found.');
            return;
        }

        const csrfToken = csrfInput.value;

        // Prevent double clicks
        if (button.dataset.loading === 'true') {
            return;
        }

        button.dataset.loading = 'true';

        fetch(form.action, {

            method: 'POST',

            headers: {
                'X-CSRFToken': csrfToken,
                'X-Requested-With': 'XMLHttpRequest'
            }

        })

        .then(async response => {

            const text = await response.text();

            if (!response.ok) {
                throw new Error(
                    'Server returned ' + response.status + ': ' + text
                );
            }

            try {
                return JSON.parse(text);
            } catch (error) {
                throw new Error(
                    'Save view did not return JSON. Server returned: ' + text
                );
            }

        })

        .then(data => {

            console.log('Save response:', data);

            // Saved
            if (data.saved === true) {

                button.classList.add('saved');

            }

            // Unsaved
            else if (data.saved === false) {

                button.classList.remove('saved');

            }

        })

        .catch(error => {

            console.error('Save error:', error);

        })

        .finally(() => {

            button.dataset.loading = 'false';

        });

    });

});


// ============================================================
// COMMENT PANEL
// ============================================================

window.toggleComments = function (postId) {

    const panel = document.getElementById(
        'comment-panel-' + postId
    );

    const wrapper = document.getElementById(
        'post-wrapper-' + postId
    );

    if (!panel || !wrapper) {

        console.error(
            'Comment panel or wrapper not found for post:',
            postId
        );

        return;
    }


    const isOpen = panel.classList.contains('open');


    // --------------------------------------------------------
    // Close all other comment panels
    // --------------------------------------------------------

    document.querySelectorAll('.comment-panel.open').forEach(
        openPanel => {

            openPanel.classList.remove('open');

            const openButton = document.querySelector(
                '[aria-controls="' + openPanel.id + '"]'
            );

            if (openButton) {

                openButton.setAttribute(
                    'aria-expanded',
                    'false'
                );

            }

        }
    );


    // Remove comments-open from all posts

    document.querySelectorAll(
        '.post-wrapper.comments-open'
    ).forEach(openWrapper => {

        openWrapper.classList.remove('comments-open');

    });


    // --------------------------------------------------------
    // Open selected comment panel
    // --------------------------------------------------------

    if (!isOpen) {

        panel.classList.add('open');

        wrapper.classList.add('comments-open');


        const button = document.querySelector(
            '[aria-controls="comment-panel-' + postId + '"]'
        );

        if (button) {

            button.setAttribute(
                'aria-expanded',
                'true'
            );

        }


        // Keep the selected post visible
        setTimeout(() => {

            wrapper.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

        }, 100);

    }

};


// ============================================================
// COMMENT FORM
// ============================================================

document.querySelectorAll('.comment-form-panel').forEach(
    form => {

        form.addEventListener('submit', function (e) {

            e.preventDefault();


            const input = form.querySelector(
                'input[name="comment"]'
            );

            const button = form.querySelector(
                '.post-comment-btn'
            );


            if (!input || !input.value.trim()) {

                return;

            }


            const csrfInput = form.querySelector(
                '[name="csrfmiddlewaretoken"]'
            );


            if (!csrfInput) {

                console.error(
                    'CSRF token not found.'
                );

                return;

            }


            const csrfToken = csrfInput.value;


            // Prevent multiple submissions

            if (button.dataset.loading === 'true') {

                return;

            }


            button.dataset.loading = 'true';


            const formData = new FormData(form);


            fetch(form.action, {

                method: 'POST',

                headers: {

                    'X-CSRFToken': csrfToken,

                    'X-Requested-With': 'XMLHttpRequest'

                },

                body: formData

            })


            .then(async response => {

                const text = await response.text();


                if (!response.ok) {

                    throw new Error(
                        'Server returned ' +
                        response.status +
                        ': ' +
                        text
                    );

                }


                // Try JSON

                try {

                    return JSON.parse(text);

                }

                catch (error) {

                    throw new Error(
                        'Comment view did not return JSON. ' +
                        'Server returned: ' +
                        text
                    );

                }

            })


            .then(data => {

                console.log(
                    'Comment response:',
                    data
                );


                // ------------------------------------------------
                // Clear input
                // ------------------------------------------------

                input.value = '';


                // ------------------------------------------------
                // Find comment panel
                // ------------------------------------------------

                const panel =
                    form.closest('.comment-panel');


                if (!panel) {

                    console.error(
                        'Comment panel not found.'
                    );

                    return;

                }


                const commentList =
                    panel.querySelector('.comment-list');


                if (!commentList) {

                    return;

                }


                // ------------------------------------------------
                // Remove "No comments yet"
                // ------------------------------------------------

                const noComments =
                    commentList.querySelector(
                        '.no-comments'
                    );


                if (noComments) {

                    noComments.remove();

                }


                // ------------------------------------------------
                // Add new comment
                // ------------------------------------------------

                if (data.comment) {

                    const commentItem =
                        document.createElement('div');


                    commentItem.className =
                        'comment-item';


                    const username =
                        data.comment.user ||
                        data.comment.username ||
                        'You';


                    const text =
                        data.comment.text ||
                        data.comment.comment ||
                        '';


                    commentItem.innerHTML = `

                        <span class="comment-user">
                            ${escapeHtml(username)}
                        </span>

                        <span class="comment-text">
                            ${escapeHtml(text)}
                        </span>

                    `;


                    commentList.prepend(
                        commentItem
                    );

                }

            })


            .catch(error => {

                console.error(
                    'Comment error:',
                    error
                );

                alert(
                    'Could not post your comment. Please try again.'
                );

            })


            .finally(() => {

                button.dataset.loading = 'false';

            });

        });

    });


// ============================================================
// ESCAPE HTML
// Prevent users from injecting HTML/JS in comments
// ============================================================

function escapeHtml(text) {

    const div =
        document.createElement('div');

    div.textContent = text;

    return div.innerHTML;

}


// ============================================================
// DOWNLOAD IMAGE
// ============================================================

function downloadImage(url, filename) {

    fetch(url)

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    'Network response was not ok'
                );

            }

            return response.blob();

        })

        .then(blob => {

            const link =
                document.createElement('a');


            const objectUrl =
                URL.createObjectURL(blob);


            link.href = objectUrl;


            link.download =
                filename || 'image.jpg';


            document.body.appendChild(link);


            link.click();


            link.remove();


            URL.revokeObjectURL(objectUrl);

        })

        .catch(error => {

            console.error(
                'Download failed:',
                error
            );

            alert(
                'Could not download the image. Please try again.'
            );

        });

}


// ============================================================
// SHARE BUTTON
// ============================================================

document.querySelectorAll('.share-btn').forEach(
    button => {

        button.addEventListener('click', function () {

            const wrapper =
                button.closest('.post-wrapper');


            if (!wrapper) return;


            const postId =
                wrapper.id.replace(
                    'post-wrapper-',
                    ''
                );


            const shareUrl =
                window.location.origin +
                '/post/' +
                postId +
                '/';


            // Modern browser share
            if (navigator.share) {

                navigator.share({

                    title: 'Mini Media',

                    text: 'Check out this post',

                    url: shareUrl

                })

                .catch(error => {

                    // User cancelled sharing
                    console.log(
                        'Share cancelled:',
                        error
                    );

                });

            }

            // Fallback
            else {

                navigator.clipboard.writeText(
                    shareUrl
                )

                .then(() => {

                    alert(
                        'Post link copied!'
                    );

                })

                .catch(() => {

                    alert(
                        'Could not copy the post link.'
                    );

                });

            }

        });

    });