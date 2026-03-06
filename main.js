
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.drop').forEach(drop => {
    const btn = drop.querySelector('.drop-btn');
    if (!btn) return;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      document.querySelectorAll('.drop.open').forEach(d => { if (d !== drop) d.classList.remove('open'); });
      drop.classList.toggle('open');
      btn.setAttribute('aria-expanded', drop.classList.contains('open') ? 'true' : 'false');
    });
  });

  document.addEventListener('click', e => {
    document.querySelectorAll('.drop.open').forEach(drop => {
      if (!drop.contains(e.target)) {
        drop.classList.remove('open');
        const btn = drop.querySelector('.drop-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  const tabs = document.querySelectorAll('.tab[data-view]');
  const views = document.querySelectorAll('.roster-view');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    views.forEach(v => v.classList.remove('active-view'));
    tab.classList.add('active');
    const target = document.getElementById(tab.dataset.view);
    if (target) target.classList.add('active-view');
  }));

  const rankButtons = document.querySelectorAll('.rank-page-btn[data-rank-group]');
  const rankGroups = document.querySelectorAll('.rank-group');
  rankButtons.forEach(button => button.addEventListener('click', () => {
    rankButtons.forEach(btn => btn.classList.remove('active'));
    rankGroups.forEach(group => group.classList.remove('active'));
    button.classList.add('active');
    const target = document.getElementById(button.dataset.rankGroup);
    if (target) target.classList.add('active');
  }));
});
