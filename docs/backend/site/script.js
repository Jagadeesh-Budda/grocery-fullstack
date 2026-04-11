document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('nav-search');
  const currentPage = document.body.dataset.page;
  const links = Array.from(document.querySelectorAll('.nav-list a'));

  if (currentPage) {
    links.forEach(link => {
      if (link.dataset.page === currentPage) {
        link.classList.add('active');
      }
    });
  }

  if (!searchInput) return;

  searchInput.addEventListener('input', event => {
    const query = event.target.value.trim().toLowerCase();
    links.forEach(link => {
      const item = link.closest('li');
      const text = link.textContent.toLowerCase();
      if (!query || text.includes(query)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  });
});
