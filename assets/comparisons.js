(() => {
  document.querySelectorAll('.comparison').forEach(comparison => {
    const controls = comparison.querySelector('.comparison-controls');
    const stage = comparison.querySelector('.comparison-stage');
    const after = comparison.querySelector('.comparison-after');
    const buttons = [...controls.querySelectorAll('button[data-split]')];
    let split = 50;
    let activePointer = null;
    const update = value => {
      split = Math.round(Math.min(100, Math.max(0, value)));
      after.style.clipPath = `inset(0 0 0 ${split}%)`;
      stage.style.setProperty('--split', `${split}%`);
      stage.setAttribute('aria-valuenow', String(split));
      stage.setAttribute('aria-valuetext', `${split}% ${stage.dataset.before}, ${100 - split}% ${stage.dataset.after}`);
      buttons.forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.split) === split)));
    };
    const updateFromPointer = event => {
      const bounds = stage.getBoundingClientRect();
      if (bounds.width > 0) update((event.clientX - bounds.left) / bounds.width * 100);
    };
    stage.setAttribute('role', 'slider');
    stage.setAttribute('tabindex', '0');
    stage.setAttribute('aria-label', stage.dataset.label);
    stage.setAttribute('aria-orientation', 'horizontal');
    stage.setAttribute('aria-valuemin', '0');
    stage.setAttribute('aria-valuemax', '100');
    stage.querySelectorAll('img').forEach(img => { img.draggable = false; });
    stage.addEventListener('pointerdown', event => {
      if (!event.isPrimary || event.button !== 0 || activePointer !== null) return;
      activePointer = event.pointerId;
      stage.setPointerCapture(activePointer);
      stage.focus({ preventScroll: true });
      updateFromPointer(event);
    });
    stage.addEventListener('pointermove', event => {
      if (event.pointerId === activePointer) updateFromPointer(event);
    });
    const finishDrag = event => {
      if (event.pointerId !== activePointer) return;
      if (event.type === 'pointerup') updateFromPointer(event);
      activePointer = null;
      if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    };
    stage.addEventListener('pointerup', finishDrag);
    stage.addEventListener('pointercancel', finishDrag);
    stage.addEventListener('lostpointercapture', () => { activePointer = null; });
    stage.addEventListener('keydown', event => {
      const step = event.shiftKey ? 10 : 1;
      const values = {
        ArrowLeft: split - step, ArrowDown: split - step,
        ArrowRight: split + step, ArrowUp: split + step,
        PageDown: split - 10, PageUp: split + 10, Home: 0, End: 100
      };
      if (!Object.prototype.hasOwnProperty.call(values, event.key)) return;
      event.preventDefault();
      update(values[event.key]);
    });
    buttons.forEach(button => button.addEventListener('click', () => update(Number(button.dataset.split))));
    comparison.classList.add('is-interactive');
    controls.hidden = false;
    update(split);
  });
})();
