const sections = {
  home: 'components/home.html',
  about: 'components/about.html',
  reflections: 'components/reflections.html',
  contact: 'components/contact.html'
};

const app = document.getElementById('app');
let currentSection = 'home';

async function loadSection(section) {
  if (!sections[section]) return;
  const res = await fetch(sections[section]);
  const html = await res.text();
  app.innerHTML = html;
  if (section === 'reflections') loadReflections();
  if (window.AOS) AOS.init({ once: true });
}

function setActiveNav(section) {
  document.querySelectorAll('#navbar-links .nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === section);
  });
}

function handleNavClick(e) {
  if (e.target.classList.contains('nav-link')) {
    e.preventDefault();
    const section = e.target.dataset.section;
    if (section) {
      currentSection = section;
      window.location.hash = section;
      loadSection(section);
      setActiveNav(section);
    }
  }
}

function handleHashChange() {
  const hash = window.location.hash.replace('#', '') || 'home';
  if (sections[hash]) {
    currentSection = hash;
    loadSection(hash);
    setActiveNav(hash);
  }
}

document.getElementById('navbar-links').addEventListener('click', handleNavClick);
window.addEventListener('hashchange', handleHashChange);

window.addEventListener('DOMContentLoaded', () => {
  handleHashChange();
});

// Reflections loader
async function loadReflections() {
  const res = await fetch('js/data/reflections.json');
  const data = await res.json();
  const container = document.getElementById('reflections-list');
  if (!container) return;
  container.innerHTML = data.topics.map((topic, i) => `
    <div class="col-md-6 col-lg-4 mb-4" data-aos="fade-up" data-aos-delay="${i*50}">
      <div class="card reflection-card h-100">
        <img src="${topic.image}" class="reflection-img card-img-top" alt="${topic.title}" loading="lazy">
        <div class="card-body">
          <h5 class="card-title">${topic.title}</h5>
          <!--<p class="card-text">${topic.description}</p>-->
          <ul class="list-unstyled small">
            <li><strong>Reflection:</strong> ${topic.reflection}</li>
          </ul>
        </div>
      </div>
    </div>
  `).join('');

  // Modal popup logic
  const triggers = container.querySelectorAll('.reflection-popup-trigger');
  triggers.forEach(trigger => {
    trigger.addEventListener('click', function() {
      showReflectionModal(data.topics[this.dataset.index], parseInt(this.dataset.index, 10));
    });
    trigger.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        showReflectionModal(data.topics[this.dataset.index], parseInt(this.dataset.index, 10));
      }
    });
  });
}

// Show modal with full reflection
function showReflectionModal(topic, idx) {
  const modal = document.getElementById('reflectionModal');
  document.getElementById('reflectionModalLabel').textContent = topic.title;
  document.getElementById('reflectionModalImg').src = `assets/images/topics/LU${idx+1}.jpg`;
  document.getElementById('reflectionModalImg').alt = topic.title;
  document.getElementById('reflectionModalText').textContent = topic.reflection;
  // Bootstrap 5 modal show
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();
}
