(() => {
  const picker = document.getElementById('download-picker');
  if (!picker) return;
  const host = picker.querySelector('#max-version');
  const variant = picker.querySelector('#build-variant');
  const download = picker.querySelector('#plugin-download');
  const tools = picker.querySelector('#glb-tools-download');
  const filename = picker.querySelector('.package-name');
  const status = picker.querySelector('.package-status');
  const ru = document.documentElement.lang === 'ru';
  function update() {
    const option = host.selectedOptions[0];
    const key = variant.value;
    const url = option.dataset[key];
    download.href = url;
    download.textContent = `${ru ? 'Скачать для Max' : 'Download for Max'} ${option.value} ↓`;
    filename.textContent = `${url.split('/').pop()} · ${option.dataset[`${key}Size`]} MB`;
    const toolsUrl = option.dataset[`${key}Tools`];
    tools.hidden = !toolsUrl;
    if (toolsUrl) tools.href = toolsUrl;
    else tools.removeAttribute('href');
    status.textContent = picker.dataset.status;
  }
  host.addEventListener('change', update);
  variant.addEventListener('change', update);
  picker.addEventListener('submit', event => event.preventDefault());
  update();
})();
