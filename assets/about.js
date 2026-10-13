const about = document.getElementById('about');
const mobile = window.matchMedia('(max-width: 700px)');

// Each layout starts with the appropriate default; native details handles toggling.
const syncLayout = () => { about.open = !mobile.matches; };
syncLayout();
mobile.addEventListener('change', syncLayout);

// The navigation link opens the section before the browser follows its anchor.
document.querySelector('.site-nav a[href="#about"]').addEventListener('click', () => {
  about.open = true;
});
