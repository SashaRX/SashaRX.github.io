const ru = document.documentElement.lang === 'ru';
const labels = ru ? {
  compare: 'Выбор примера', lodAlt: 'Просмотр LOD в тестовой сцене: ',
  lodCaption: 'Объекты без LOD-имён скрыты. Показан ',
  depthOn: 'Depth test: включён', depthOff: 'Depth test: выключен', allLods: 'Все LOD'
} : {
  compare: 'Choose an example', lodAlt: 'LOD preview in the test scene: ',
  lodCaption: 'Objects without LOD names hidden. Showing ',
  depthOn: 'Depth test: on', depthOff: 'Depth test: off', allLods: 'All LODs'
};

document.documentElement.classList.add('has-guide-js');
const printButton = document.getElementById('print');
printButton.addEventListener('click', async () => {
  const original = printButton.textContent;
  printButton.disabled = true;
  printButton.textContent = ru ? 'Загрузка…' : 'Loading…';
  try {
    const images = [...document.querySelectorAll('main img')];
    await Promise.all(images.map(img => {
      img.loading = 'eager';
      return img.decode();
    }));
    window.print();
  } catch {
    window.alert(ru ? 'Не удалось загрузить все иллюстрации. Проверь подключение и повтори печать.' : 'Some illustrations could not load. Check your connection and try printing again.');
  } finally {
    printButton.disabled = false;
    printButton.textContent = original;
  }
});
const sidebar = document.querySelector('.sidebar');
const toggle = document.getElementById('menu-toggle');
toggle.addEventListener('click', () => {
  toggle.setAttribute('aria-expanded', sidebar.classList.toggle('open'));
});
document.querySelector('.contents-nav').addEventListener('click', event => {
  if (!event.target.closest('a')) return;
  sidebar.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  if (window.matchMedia('(max-width: 800px)').matches) toggle.focus({ preventScroll: true });
});

function imageBlock(asset) {
  const image = document.querySelector(`img[data-asset="${asset}"]`);
  if (!image) throw Error(`Missing illustration ${asset}`);
  const paragraph = image.closest('p');
  const next = paragraph.nextElementSibling;
  return { paragraph, caption: next?.matches('p') && next.querySelector('em') ? next : null };
}

function compare(assets, titles, extras = []) {
  const found = assets.map(imageBlock);
  const box = document.createElement('div');
  box.className = 'comparison';
  const controls = document.createElement('div');
  controls.className = 'compare-controls';
  controls.setAttribute('aria-label', labels.compare);
  box.append(controls);
  found[0].paragraph.before(box);
  const panes = [];
  for (const item of found) {
    const pane = document.createElement('div');
    pane.className = 'compare-pane';
    pane.append(item.paragraph);
    if (item.caption) pane.append(item.caption);
    box.append(pane);
    panes.push(pane);
  }
  for (const extra of extras) {
    const pane = document.createElement('div');
    pane.className = 'compare-pane';
    pane.dataset.extra = 'true';
    const link = document.createElement('a');
    link.className = 'zoom-link';
    link.href = extra.src;
    const img = document.createElement('img');
    img.src = extra.src;
    img.alt = labels.lodAlt + extra.label;
    img.width = 968;
    img.height = 496;
    img.loading = 'lazy';
    img.decoding = 'async';
    link.append(img);
    pane.append(link);
    const text = document.createElement('p');
    text.textContent = labels.lodCaption + extra.label;
    pane.append(text);
    box.append(pane);
    panes.push(pane);
    titles.push(extra.label);
  }
  const buttons = titles.map((title, index) => {
    const button = document.createElement('button');
    button.textContent = title;
    button.addEventListener('click', () => {
      panes.forEach((pane, i) => { pane.hidden = i !== index; });
      buttons.forEach((b, i) => b.setAttribute('aria-pressed', i === index));
    });
    controls.append(button);
    return button;
  });
  buttons[0].click();
}
compare(['guide/images/uv-depth-on.png', 'guide/images/uv-depth-off.png'], [labels.depthOn, labels.depthOff]);
compare(['guide/images/lod-all.png', 'guide/images/lod1.png'], [labels.allLods, 'LOD1'], [
  { label: 'LOD0', src: '/modelbatch/guide/images/lod0.png' },
  { label: 'LOD2', src: '/modelbatch/guide/images/lod2.png' }
]);

const dialog = document.getElementById('zoom');
let opener;
document.getElementById('close-zoom').addEventListener('click', () => dialog.close());
document.querySelector('main').addEventListener('click', event => {
  const link = event.target.closest('.zoom-link');
  if (!link) return;
  event.preventDefault();
  opener = link;
  const illustration = link.querySelector('img');
  const zoom = dialog.querySelector('img');
  zoom.src = illustration.src;
  zoom.alt = illustration.alt;
  dialog.showModal();
});
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => opener?.focus({ preventScroll: true }));

const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      document.querySelectorAll('.contents-nav a').forEach(a => {
        const active = a.hash === '#' + entry.target.id;
        a.classList.toggle('active', active);
        if (active) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
    }
  }
}, { rootMargin: '-5% 0px -75% 0px' });
document.querySelectorAll('h2[id]').forEach(h => observer.observe(h));

// Lazy images and collapsed notes must also be present when printing the guide.
let openNotes = [];
window.addEventListener('beforeprint', () => {
  openNotes = [...document.querySelectorAll('.capture-note')].filter(note => !note.open);
  openNotes.forEach(note => { note.open = true; });
  document.querySelectorAll('main img[loading="lazy"]').forEach(img => { img.loading = 'eager'; });
});
window.addEventListener('afterprint', () => {
  openNotes.forEach(note => { note.open = false; });
  openNotes = [];
});
