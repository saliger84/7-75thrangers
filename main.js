
const drops = document.querySelectorAll("[data-drop]");
drops.forEach(d => {
  const btn = d.querySelector("[data-dropbtn]");
  if (!btn) return;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    drops.forEach(x => { if (x !== d) x.classList.remove("open"); });
    d.classList.toggle("open");
  });
});
document.addEventListener("click", (e) => {
  if (!e.target.closest("[data-drop]")) drops.forEach(x => x.classList.remove("open"));
});
document.getElementById("year")?.textContent = new Date().getFullYear();
