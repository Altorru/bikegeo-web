// Theme choice stays in this tab; no cookies or storage.
const root = document.documentElement;
const control = document.getElementById('theme');
const system = matchMedia('(prefers-color-scheme: light)');
let choice = null;
const dark = () => choice ? choice === 'dark' : !system.matches;
function render() {
  const fr = root.lang !== 'en';
  const next = dark() ? 'light' : 'dark';
  const label = fr ? (next === 'light' ? 'Thème clair' : 'Thème sombre') : (next === 'light' ? 'Light theme' : 'Dark theme');
  control.setAttribute('aria-label', label);
  control.querySelector('span').textContent = label;
  control.querySelector('img').src = new URL(`icons/${next === 'light' ? 'sun' : 'moon'}.svg`, import.meta.url).href;
  document.querySelectorAll('.brand-logo').forEach(img => {
    img.src = new URL(`logo-${dark() ? 'dark' : 'light'}.svg`, import.meta.url).href;
  });
}
control.addEventListener('click', () => { choice = dark() ? 'light' : 'dark'; root.dataset.theme = choice; render(); });
system.addEventListener('change', render);
new MutationObserver(render).observe(root, { attributes: true, attributeFilter: ['lang'] });
render();
