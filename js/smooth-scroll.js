document.addEventListener('click', function(e) {
  if (e.target.matches('.nav-link')) {
    const section = e.target.getAttribute('href');
    if (section && section.startsWith('#')) {
      e.preventDefault();
      document.querySelector(section)?.scrollIntoView({ behavior: 'smooth' });
    }
  }
});

// Scroll spy (for static sections, fallback if JS navigation not used)
window.addEventListener('scroll', () => {
  const links = document.querySelectorAll('#navbar-links .nav-link');
  let fromTop = window.scrollY + 80;
  links.forEach(link => {
    const sectionId = link.getAttribute('href');
    const section = document.querySelector(sectionId);
    if (section) {
      if (
        section.offsetTop <= fromTop &&
        section.offsetTop + section.offsetHeight > fromTop
      ) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
});
