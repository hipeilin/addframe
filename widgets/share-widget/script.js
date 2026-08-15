(() => {
  // ======================= CONFIGURE =======================
  const SHARE_URL = 'https://example.com/';
  const SHARE_TEXT = 'Your site name — a one-line description';
  // ===========================================================

  const widget = document.getElementById('shareWidget');
  const toggle = document.getElementById('shareToggle');
  const menu = document.getElementById('shareMenu');
  const copyBtn = document.getElementById('copyLinkBtn');
  const copyLabel = document.getElementById('copyLinkLabel');

  const encodedUrl = encodeURIComponent(SHARE_URL);
  const encodedText = encodeURIComponent(SHARE_TEXT);

  const shareLinks = {
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedText}&body=${encodedUrl}`,
  };

  widget.querySelectorAll('[data-network]').forEach((el) => {
    const href = shareLinks[el.getAttribute('data-network')];
    if (href) el.setAttribute('href', href);
  });

  function closeMenu() {
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
  }

  toggle.addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({ title: SHARE_TEXT, url: SHARE_URL }).catch(() => {});
      return;
    }
    if (menu.hidden) openMenu();
    else closeMenu();
  });

  document.addEventListener('click', (e) => {
    if (!menu.hidden && !widget.contains(e.target)) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) closeMenu();
  });

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      copyLabel.textContent = 'Copied!';
      setTimeout(() => {
        copyLabel.textContent = 'Copy link';
      }, 1500);
    } catch {
      // Clipboard API unavailable; nothing more we can do here.
    }
  });
})();
