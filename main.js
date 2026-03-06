
function formatForumDate(input) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

async function loadForumNews() {
  try {
    const res = await fetch('news-posts.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('news-posts.json not found');
    const posts = await res.json();
    const sorted = posts.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

    const homeList = document.getElementById('homepageNewsList');
    if (homeList) {
      homeList.innerHTML = sorted.slice(0, 10).map(post => `<li>${post.title}</li>`).join('');
    }

    const newsGrid = document.getElementById('newsPageGrid');
    if (newsGrid) {
      newsGrid.innerHTML = sorted.map(post => `
        <article class="news-post-card">
          <h2>${post.title}</h2>
          <div class="news-post-body">
            <div class="news-post-meta">By ${post.author} • ${formatForumDate(post.date)}</div>
            <p>${post.body || post.excerpt || ''}</p>
          </div>
        </article>
      `).join('');
    }

    const generalLast = document.getElementById('generalLastPost');
    if (generalLast && sorted[0]) {
      generalLast.innerHTML = `
        <img src="icon_ranks.png" alt="">
        <div>
          <div class="last-post-title">${sorted[0].title}</div>
          <div class="last-post-meta">By ${sorted[0].author}</div>
          <div class="last-post-date">${formatForumDate(sorted[0].date)}</div>
        </div>
      `;
    }
  } catch (err) {
    console.error('Failed to load shared news posts:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadForumNews();

  // MILHQ dropdown
  const drops = document.querySelectorAll('[data-drop]');

  drops.forEach(drop => {
    const btn = drop.querySelector('[data-dropbtn]');
    if (!btn) return;

    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();

      const isOpen = drop.classList.contains('open');

      drops.forEach(d => {
        d.classList.remove('open');
        const otherBtn = d.querySelector('[data-dropbtn]');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        drop.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', () => {
    drops.forEach(d => {
      d.classList.remove('open');
      const btn = d.querySelector('[data-dropbtn]');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  });
});