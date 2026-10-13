(() => {
  const picker = document.getElementById('download-picker');
  if (!picker) return;
  const host = picker.querySelector('#max-version');
  const variant = picker.querySelector('#build-variant');
  const download = picker.querySelector('#plugin-download');
  const filename = picker.querySelector('.package-name');
  const status = picker.querySelector('.package-status');
  const ru = document.documentElement.lang === 'ru';
  function update() {
    const option = host.selectedOptions[0];
    const mesh = variant.value === 'mesh';
    const url = mesh ? option.dataset.mesh : option.dataset.standard;
    download.href = url;
    download.textContent = `${ru ? 'Скачать для Max' : 'Download for Max'} ${option.value} ↓`;
    filename.textContent = `${url.split('/').pop()} · ${mesh ? option.dataset.meshSize : option.dataset.standardSize} MB`;
    status.textContent = option.value === '2024' ? picker.dataset.verified : picker.dataset.pending;
  }
  host.addEventListener('change', update);
  variant.addEventListener('change', update);
  picker.addEventListener('submit', event => event.preventDefault());
  update();
})();
