(() => {
  const galleries = [...document.querySelectorAll('.atmosphere-gallery')];
  if (!galleries.length || typeof HTMLDialogElement === 'undefined' ||
      typeof HTMLDialogElement.prototype.showModal !== 'function') return;

  const ru = document.documentElement.lang === 'ru';
  const labels = ru ? {
    title: 'Скриншоты Atmosphere', close: 'Закрыть просмотр',
    prev: 'Предыдущий скриншот', next: 'Следующий скриншот',
    hint: '← → — перелистывание · Esc — закрыть · на телефоне можно свайпать',
    count: (current, total) => `${current} из ${total}`
  } : {
    title: 'Atmosphere screenshots', close: 'Close viewer',
    prev: 'Previous screenshot', next: 'Next screenshot',
    hint: '← → to browse · Esc to close · swipe on touchscreens',
    count: (current, total) => `${current} of ${total}`
  };

  const dialog = document.createElement('dialog');
  dialog.className = 'gallery-viewer';
  dialog.setAttribute('aria-labelledby', 'gallery-viewer-title');
  dialog.innerHTML = `
    <h2 class="gallery-title" id="gallery-viewer-title"></h2>
    <div class="gallery-toolbar">
      <span class="gallery-counter" role="status" aria-live="polite" aria-atomic="true"></span>
      <button type="button" class="gallery-close" autofocus><span aria-hidden="true">×</span></button>
    </div>
    <div class="gallery-stage">
      <img alt="" draggable="false">
      <button type="button" class="gallery-prev"><span aria-hidden="true">‹</span></button>
      <button type="button" class="gallery-next"><span aria-hidden="true">›</span></button>
    </div>
    <div class="gallery-footer">
      <p class="gallery-caption"></p>
      <p class="gallery-hint"></p>
    </div>`;
  document.body.append(dialog);

  const close = dialog.querySelector('.gallery-close');
  const prev = dialog.querySelector('.gallery-prev');
  const next = dialog.querySelector('.gallery-next');
  const stage = dialog.querySelector('.gallery-stage');
  const image = stage.querySelector('img');
  const caption = dialog.querySelector('.gallery-caption');
  const counter = dialog.querySelector('.gallery-counter');
  dialog.querySelector('.gallery-title').textContent = labels.title;
  dialog.querySelector('.gallery-hint').textContent = labels.hint;
  close.setAttribute('aria-label', labels.close);
  prev.setAttribute('aria-label', labels.prev);
  next.setAttribute('aria-label', labels.next);

  let items = [];
  let index = 0;
  let opener = null;
  let gesture = null;
  let backdropPressed = false;

  function show(position) {
    index = (position + items.length) % items.length;
    const item = items[index];
    image.src = item.link.href;
    image.alt = item.alt;
    caption.textContent = item.caption;
    counter.textContent = labels.count(index + 1, items.length);
    prev.hidden = next.hidden = items.length < 2;
  }

  for (const gallery of galleries) {
    const entries = [...gallery.querySelectorAll('figure a')].map(link => ({
      link,
      alt: link.querySelector('img')?.alt || '',
      caption: link.closest('figure').querySelector('figcaption')?.textContent || ''
    }));
    for (const [position, item] of entries.entries()) {
      item.link.setAttribute('aria-haspopup', 'dialog');
      item.link.addEventListener('click', event => {
        if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        items = entries;
        opener = item.link;
        show(position);
        dialog.showModal();
        document.documentElement.classList.add('gallery-open');
      });
    }
  }

  close.addEventListener('click', () => dialog.close());
  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      const controls = [close, prev, next].filter(button => !button.hidden);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
      return;
    }
    const position = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: items.length - 1 }[event.key];
    if (position === undefined) return;
    event.preventDefault();
    show(position);
  });
  dialog.addEventListener('pointerdown', event => {
    backdropPressed = event.target === dialog || event.target === stage;
  });
  dialog.addEventListener('click', event => {
    if (backdropPressed && (event.target === dialog || event.target === stage)) dialog.close();
    backdropPressed = false;
  });
  stage.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch' || event.target.closest('button')) return;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
  });
  stage.addEventListener('pointerup', event => {
    if (!gesture || gesture.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    gesture = null;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    backdropPressed = false;
    show(index + (dx < 0 ? 1 : -1));
  });
  stage.addEventListener('pointercancel', () => { gesture = null; });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('gallery-open');
    image.removeAttribute('src');
    gesture = null;
    backdropPressed = false;
    opener?.focus({ preventScroll: true });
  });
})();
