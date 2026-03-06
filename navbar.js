document.addEventListener("DOMContentLoaded", async () => {
  const target = document.getElementById("site-navbar");
  if (!target) return;

  try {
    const response = await fetch("navbar.html");
    const html = await response.text();
    target.innerHTML = html;
    setActiveNavLink();
  } catch (err) {
    console.error("Navbar failed to load:", err);
  }
});

function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll(".main-nav a");

  links.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
    }
  });
}
