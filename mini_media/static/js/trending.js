// Filter tabs (Today / This Week / This Month / All)
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      // Hook point: filter posts by tab.dataset.filter when wired to real data
    });
  });

  // Category dropdown
  function toggleCategoryMenu() {
    document.getElementById('categoryDropdown').classList.toggle('open');
  }

  document.querySelectorAll('.category-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.category-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      document.getElementById('categoryLabel').textContent = opt.textContent.trim();
      document.getElementById('categoryDropdown').classList.remove('open');
      // Hook point: filter posts by opt.dataset.value when wired to real data
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.category-dropdown')) {
      document.getElementById('categoryDropdown').classList.remove('open');
    }
  });

  // ---------- COMMENT SIDEBAR (shared by every post) ----------
  let currentOpenPanel = null;

  function returnPanelHome(panel) {
    if (panel._homeParent) {
      if (panel._homeNext && panel._homeNext.parentNode === panel._homeParent) {
        panel._homeParent.insertBefore(panel, panel._homeNext);
      } else {
        panel._homeParent.appendChild(panel);
      }
    }
  }

  function toggleComments(postId) {
    const panel = document.getElementById('comment-panel-' + postId);
    if (!panel) return;

    const sidebar = document.getElementById('commentSidebar');
    const overlay = document.getElementById('commentSidebarOverlay');
    const content = document.getElementById('commentSidebarContent');
    const toggleBtn = document.querySelector('[aria-controls="comment-panel-' + postId + '"]');

    // clicking the same post's button again while its sidebar is open closes it
    if (currentOpenPanel === panel && sidebar.classList.contains('open')) {
      closeCommentSidebar();
      return;
    }

    // remember this panel's original spot in the page, once
    if (!panel._homeParent) {
      panel._homeParent = panel.parentElement;
      panel._homeNext = panel.nextSibling;
    }

    // if a different post's panel is currently in the sidebar, send it home first
    if (currentOpenPanel && currentOpenPanel !== panel) {
      returnPanelHome(currentOpenPanel);
    }

    content.appendChild(panel);
    currentOpenPanel = panel;

    sidebar.classList.add('open');
    overlay.classList.add('open');

    document.querySelectorAll('.comment-toggle-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closeCommentSidebar() {
    const sidebar = document.getElementById('commentSidebar');
    const overlay = document.getElementById('commentSidebarOverlay');

    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    document.querySelectorAll('.comment-toggle-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));

    if (currentOpenPanel) {
      returnPanelHome(currentOpenPanel);
      currentOpenPanel = null;
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCommentSidebar();
  });

  // ---------- SHARE BUTTON ----------
  function sharePost(postId, description) {
    const shareUrl = window.location.origin + window.location.pathname + '#post-' + postId;

    if (navigator.share) {
      navigator.share({
        title: 'PIXI',
        text: description || 'Check out this post on PIXI',
        url: shareUrl
      }).catch(() => {});
      return;
    }

    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      alert(shareUrl);
    });
  }

  // ---------- IMAGE LIGHTBOX (View button) ----------
  function openImageView(url) {
    const overlay = document.getElementById('imageLightboxOverlay');
    const img = document.getElementById('lightboxImg');
    img.src = url;
    overlay.classList.add('open');
  }

  function closeImageView() {
    document.getElementById('imageLightboxOverlay').classList.remove('open');
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeImageView();
  });

  // ---------- LIKE BUTTON ----------
  document.querySelectorAll('.like-form').forEach(form => {
    const button = form.querySelector('.like-btn');
    if (!button) return;

    button.addEventListener('click', () => {
      const csrfInput = form.querySelector('[name="csrfmiddlewaretoken"]');
      const csrfToken = csrfInput ? csrfInput.value : '';

      fetch(form.action, {
        method: 'POST',
        headers: { 'X-CSRFToken': csrfToken }
      })
      .then(async response => {
        const text = await response.text();
        if (!response.ok) {
          throw new Error('Server returned ' + response.status + ': ' + text);
        }
        try {
          return JSON.parse(text);
        } catch (error) {
          throw new Error('Like view did not return JSON. Server returned: ' + text);
        }
      })
      .then(data => {
        button.classList.toggle('liked', !!data.liked);
        const countEl = button.querySelector('.like-count');
        if (countEl && typeof data.likes_count !== 'undefined') {
          countEl.textContent = data.likes_count;
        }
      })
      .catch(error => {
        console.error('Like error:', error);
      });
    });
  });

  // ---------- COMMENT FORM (submit inside the expandable panel) ----------
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  document.querySelectorAll('.comment-form-panel').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const input = form.querySelector('input[name="comment"]');
      if (!input || !input.value.trim()) {
        return;
      }

      const csrfInput = form.querySelector('[name="csrfmiddlewaretoken"]');
      const csrfToken = csrfInput ? csrfInput.value : '';
      const formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        headers: { 'X-CSRFToken': csrfToken },
        body: formData
      })
      .then(async response => {
        const text = await response.text();
        if (!response.ok) {
          throw new Error('Server returned ' + response.status + ': ' + text);
        }
        try {
          return JSON.parse(text);
        } catch (error) {
          throw new Error('Comment view did not return JSON. Server returned: ' + text);
        }
      })
      .then(data => {
        const panel = form.closest('.comment-panel');
        if (!panel) return;

        const commentList = panel.querySelector('.comment-list');
        if (!commentList) return;

        if (data.comment) {
          const noComments = commentList.querySelector('.no-comments');
          if (noComments) noComments.remove();

          const commentItem = document.createElement('div');
          commentItem.className = 'comment-item';
          commentItem.innerHTML =
            '<span class="comment-user">' + escapeHtml(data.comment.user) + '</span>' +
            '<span class="comment-text">' + escapeHtml(data.comment.text) + '</span>';
          commentList.prepend(commentItem);
        }

        input.value = '';
      })
      .catch(error => {
        console.error('Comment error:', error);
        alert('Could not post your comment. Please try again.');
      });
    });
  });