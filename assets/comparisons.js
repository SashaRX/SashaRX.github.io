(() => {
  document.querySelectorAll('.comparison').forEach(comparison => {
    const controls = comparison.querySelector('.comparison-controls');
    const slider = controls.querySelector('input');
    const stage = comparison.querySelector('.comparison-stage');
    const after = comparison.querySelector('.comparison-after');
    const buttons = [...controls.querySelectorAll('button[data-split]')];
    const update = () => {
      const split = Math.min(100, Math.max(0, Number(slider.value)));
      after.style.clipPath = `inset(0 0 0 ${split}%)`;
      stage.style.setProperty('--split', `${split}%`);
      slider.setAttribute('aria-valuetext', `${split}% ${slider.dataset.before}, ${100 - split}% ${slider.dataset.after}`);
      buttons.forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.split) === split)));
    };
    slider.addEventListener('input', update);
    buttons.forEach(button => button.addEventListener('click', () => {
      slider.value = button.dataset.split;
      update();
    }));
    comparison.classList.add('is-interactive');
    controls.hidden = false;
    update();
  });
})();
