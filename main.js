
document.addEventListener('click', (e) => {
  const dd = document.querySelector('.dropdown');
  const menu = document.querySelector('.dropdown-menu');
  const btn = document.querySelector('.dropbtn');
  if(!dd || !menu || !btn) return;
  if(!dd.contains(e.target)) menu.style.display = 'none';
});
document.querySelectorAll('.dropbtn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const menu = btn.parentElement.querySelector('.dropdown-menu');
    if(!menu) return;
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
  });
});
