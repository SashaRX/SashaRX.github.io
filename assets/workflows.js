(() => {
  const form = document.getElementById('workflow-filters');
  if (!form) return;
  const ru = document.documentElement.lang === 'ru';
  const workflows = [...document.querySelectorAll('.workflow')];
  const search = form.querySelector('input');
  const tool = form.querySelector('select');
  const count = document.getElementById('workflow-count');
  const empty = document.getElementById('workflow-empty');
  const params = new URLSearchParams(location.search);
  tool.value = ['max', 'fbx'].includes(params.get('tool')) ? params.get('tool') : 'all';
  search.value = params.get('q') || '';
  const searchable = workflows.map(item => ({
    item, text: `${item.textContent} ${item.dataset.keywords}`.toLocaleLowerCase()
  }));
  function update() {
    const terms = search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let shown = 0;
    searchable.forEach(({ item, text }) => {
      const matches = (tool.value === 'all' || item.dataset.tool === tool.value) && terms.every(term => text.includes(term));
      item.hidden = !matches;
      if (matches) shown++;
    });
    count.textContent = ru ? `Показано: ${shown} из ${workflows.length}` : `Showing ${shown} of ${workflows.length}`;
    empty.hidden = shown !== 0;
    const url = new URL(location.href);
    if (tool.value === 'all') url.searchParams.delete('tool');
    else url.searchParams.set('tool', tool.value);
    if (search.value.trim()) url.searchParams.set('q', search.value.trim());
    else url.searchParams.delete('q');
    history.replaceState(null, '', url);
    document.querySelectorAll('a[data-language]').forEach(link => {
      const target = new URL(link.href);
      target.search = url.search;
      target.hash = url.hash;
      link.href = target.href;
    });
  }
  function openLinkedWorkflow() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const item = workflows.find(workflow => workflow.id === id);
    if (!item) return;
    search.value = '';
    tool.value = 'all';
    update();
    item.open = true;
    requestAnimationFrame(() => item.scrollIntoView({ block: 'start' }));
  }
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.querySelector('button').addEventListener('click', () => {
    search.value = '';
    tool.value = 'all';
    update();
    search.focus();
  });
  window.addEventListener('hashchange', openLinkedWorkflow);
  document.querySelectorAll('.command-copy').forEach(button => {
    const code = button.parentElement.querySelector('code');
    const status = button.parentElement.querySelector('.copy-status');
    button.hidden = false;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.textContent);
        status.textContent = ru ? 'Скопировано.' : 'Copied.';
      } catch {
        const selection = window.getSelection();
        if (selection) {
          const range = document.createRange();
          range.selectNodeContents(code);
          selection.removeAllRanges();
          selection.addRange(range);
        }
        status.textContent = ru ? 'Нажми Ctrl+C или используй меню копирования.' : 'Press Ctrl+C or use the copy menu.';
      }
    });
  });
  form.hidden = false;
  update();
  openLinkedWorkflow();
})();
