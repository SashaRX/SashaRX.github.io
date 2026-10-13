import { options } from './options-catalog.js?v=20261014-fbx101';

const selectable = new Map(options.filter(option => ['repair', 'diagnostic', 'modifier'].includes(option.kind)).map(option => [option.flag, option]));
const aliases = new Map(options.flatMap(option => option.aliases.map(alias => [alias, option.flag])));
function pathValue(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) return trimmed.slice(1, -1);
  return trimmed;
}
function validPath(value) { return !/^-/.test(value) && !/["\u0000-\u001f\u007f]/.test(value); }
function quote(value) {
  // PowerShell literal strings preserve $, backticks, spaces and apostrophes.
  return `'${value.replaceAll("'", "''")}'`;
}
function expandFlags(selected) {
  const expanded = new Set(selected);
  for (const flag of expanded) for (const required of selectable.get(flag).requires) expanded.add(required);
  return expanded;
}
export function buildCommand(config) {
  if (!['audit', 'inspect', 'preview', 'apply', 'help', 'version'].includes(config.mode)) return { error: 'mode' };
  if (config.mode === 'help' || config.mode === 'version') return { command: `.\\patch_fbx.exe --${config.mode}`, args: [`--${config.mode}`], inputs: 0, repairs: 0, added: [] };
  const paths = [...new Set(config.paths.split(/\r\n|\r|\n/).map(pathValue).filter(Boolean))];
  if (!paths.length) return { error: 'paths' };
  if (paths.some(path => !validPath(path))) return { error: 'invalidPaths' };
  const report = pathValue(config.report || '');
  const textureRoot = pathValue(config.textureRoot || '');
  const inspect = config.mode === 'inspect';
  const repair = config.mode === 'preview' || config.mode === 'apply';
  const selected = inspect ? [] : [...new Set((config.flags || []).map(flag => aliases.get(flag) || flag))];
  if (selected.some(flag => !selectable.has(flag))) return { error: 'flags' };
  const expanded = expandFlags(selected);
  const repairs = [...expanded].filter(flag => selectable.get(flag).kind === 'repair');
  if (!repair && repairs.length) return { error: 'auditRepairs' };
  if (repair && !repairs.length) return { error: 'patches' };
  const jobs = Number(config.jobs);
  if (!inspect && (!Number.isInteger(jobs) || jobs < 1 || jobs > 64)) return { error: 'jobs' };
  if (!inspect && report && !validPath(report)) return { error: 'report' };
  const usesTextures = expanded.has('--guess-textures');
  if (usesTextures && textureRoot && !validPath(textureRoot)) return { error: 'textureRoot' };
  const flags = [];
  if (inspect) flags.push('--inspect');
  if (config.mode === 'preview') flags.push('-n');
  if (config.recursive) flags.push('-r');
  if (!inspect) {
    flags.push('-j', String(jobs));
    if (config.verbose) flags.push('-v');
    if (config.shortPaths) flags.push('--short-paths');
    if (config.mode === 'apply' && config.noBackup) flags.push('--no-backup');
    // Stable catalog order keeps copied commands easy to compare.
    flags.push(...options.filter(option => expanded.has(option.flag)).map(option => option.flag));
  }
  const args = [...flags];
  const command = ['.\\patch_fbx.exe', ...flags];
  if (usesTextures && textureRoot) { args.push('--texture-root', textureRoot); command.push('--texture-root', quote(textureRoot)); }
  if (!inspect && report) { args.push('--report-file', report); command.push('--report-file', quote(report)); }
  args.push(...paths);
  command.push(...paths.map(quote));
  return { command: command.join(' '), args, inputs: paths.length, repairs: repairs.length, added: [...expanded].filter(flag => !selected.includes(flag)) };
}
function initBuilder() {
  const form = document.querySelector('#command-builder');
  if (!form) return;
  const ru = document.documentElement.lang === 'ru';
  const text = ru ? {
    paths: 'Укажи хотя бы одну папку или FBX — каждый путь с новой строки.',
    invalidPaths: 'Проверь пути: без управляющих символов и кавычек внутри. Для имени, начинающегося с «-», добавь .\\ или полный путь.',
    mode: 'Выбери режим обработки.', patches: 'Выбери хотя бы одно исправление или готовый набор.',
    flags: 'Неизвестный параметр. Выбери его из справочника.', auditRepairs: 'Для исправлений выбери «Предпросмотр» или «Применить».',
    jobs: 'Число процессов должно быть целым: от 1 до 64.', report: 'Проверь путь к отчёту.', textureRoot: 'Проверь путь к папке текстур.',
    copied: 'Команда скопирована.', manual: 'Команда выделена — нажми Ctrl+C для копирования.',
    audit: 'Только проверка и отчёт. Исходные FBX не меняются; можно выбрать отдельные диагностики.',
    inspect: 'Подробные данные мешей и материалов в консоли. Без исправлений и файла отчёта.',
    preview: 'Показать планируемые изменения. FBX и резервные копии не записываются.',
    apply: 'Применяет выбранные исправления и создаёт .fbx.bak по умолчанию. Сначала проверь предпросмотр. Неоднозначные общие UV-привязки сохраняются с предупреждением UVSET-CONFLICT.',
    help: 'Встроенная полная справка EXE. Входные файлы не нужны.', version: 'Версии EXE и встроенного FBX SDK. Входные файлы не нужны.',
    dependencies: flags => ` Добавлены зависимости: ${flags.join(', ')}.`, selected: count => `выбрано: ${count}`,
    ready: count => `Готово · путей: ${count}. Запусти в PowerShell из папки с patch_fbx.exe.`
  } : {
    paths: 'Enter at least one folder or FBX file, one path per line.',
    invalidPaths: 'Check paths: no control characters or quotes inside. Prefix names starting with “-” with .\\ or use a full path.',
    mode: 'Choose an operation.', patches: 'Select at least one repair or choose a preset.',
    flags: 'Unknown option. Choose it from the reference.', auditRepairs: 'Choose Preview or Apply to use repairs.',
    jobs: 'Worker count must be a whole number from 1 to 64.', report: 'Check the report path.', textureRoot: 'Check the texture folder path.',
    copied: 'Command copied.', manual: 'Command selected — press Ctrl+C to copy.',
    audit: 'Scan and report only. Original FBX files stay unchanged; select individual diagnostics as needed.',
    inspect: 'Detailed mesh and material data in the console. No repairs or report file.',
    preview: 'Show proposed changes. No FBX writes or backups.',
    apply: 'Applies the selected repairs with a .fbx.bak backup by default. Check the preview first. Ambiguous shared UV bindings are preserved with a UVSET-CONFLICT warning.',
    help: 'Complete built-in EXE help. No input files needed.', version: 'Tool and linked FBX SDK versions. No input files needed.',
    dependencies: flags => ` Added dependencies: ${flags.join(', ')}.`, selected: count => `${count} selected`,
    ready: count => `Ready · ${count} input path(s). Run in PowerShell beside patch_fbx.exe.`
  };
  const fields = form.elements;
  const output = form.querySelector('#generated-command');
  const status = form.querySelector('#builder-status');
  const copyButton = form.querySelector('#copy-command');
  const textureField = form.querySelector('#texture-field');
  const checkboxes = [...form.querySelectorAll('[name="flag"]')];
  function update() {
    const mode = fields.mode.value;
    const info = mode === 'help' || mode === 'version';
    const inspect = mode === 'inspect';
    const repair = mode === 'preview' || mode === 'apply';
    fields.paths.disabled = fields.recursive.disabled = info;
    fields.report.disabled = fields.jobs.disabled = fields.verbose.disabled = fields.shortPaths.disabled = info || inspect;
    fields.noBackup.disabled = mode !== 'apply';
    checkboxes.forEach(box => {
      const option = selectable.get(box.value);
      box.disabled = info || inspect || (!repair && (option.kind !== 'diagnostic' || option.requires.length > 0));
    });
    const selected = checkboxes.filter(box => box.checked && !box.disabled).map(box => box.value);
    const usesTextures = repair && expandFlags(selected).has('--guess-textures');
    textureField.hidden = !usesTextures;
    fields.textureRoot.disabled = !usesTextures;
    const modeHelp = form.querySelector('#mode-help');
    modeHelp.textContent = text[mode];
    modeHelp.classList.toggle('apply-notice', mode === 'apply');
    form.querySelectorAll('.builder-option-group').forEach(group => {
      const count = [...group.querySelectorAll('input')].filter(box => box.checked && !box.disabled).length;
      group.querySelector('.selected-count').textContent = count ? text.selected(count) : '';
    });
    const result = buildCommand({mode, paths: fields.paths.value, recursive: fields.recursive.checked,
      verbose: fields.verbose.checked, report: fields.report.value, jobs: fields.jobs.value,
      shortPaths: fields.shortPaths.checked, noBackup: fields.noBackup.checked,
      flags: selected, textureRoot: fields.textureRoot.value});
    output.value = result.command || '';
    copyButton.disabled = !!result.error;
    status.textContent = result.error ? text[result.error] : text.ready(result.inputs) + (result.added.length ? text.dependencies(result.added) : '');
  }
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  const presets = {
    cleanup: ['--strip-col-data', '--strip-tangents-binormals', '--remove-orphan-vertices', '--remove-degenerate-polys'],
    materials: ['--apply-materials-patch', '--fix-mat-layers', '--guess-textures'],
    units: ['--convert-to-meters', '--bake-non-identity-scale'], reset: []
  };
  for (const button of form.querySelectorAll('[data-preset]')) {
    button.addEventListener('click', () => {
      const selected = presets[button.dataset.preset];
      fields.mode.value = selected.length ? 'preview' : 'audit';
      fields.noBackup.checked = false;
      checkboxes.forEach(box => { box.checked = selected.includes(box.value); });
      form.querySelectorAll('.builder-option-group').forEach(group => {
        group.open = [...group.querySelectorAll('input')].some(box => box.checked);
      });
      update();
    });
  }
  copyButton.addEventListener('click', async () => {
    const command = output.value;
    try {
      await navigator.clipboard.writeText(command);
      if (output.value === command) status.textContent = text.copied;
    } catch {
      if (output.value !== command) return;
      output.focus(); output.select(); status.textContent = text.manual;
    }
  });
  update();
  form.hidden = false;
}
function initReference() {
  const search = document.querySelector('#option-search');
  if (!search) return;
  const groups = [...document.querySelectorAll('.option-reference .option-group')];
  const ru = document.documentElement.lang === 'ru';
  const count = document.querySelector('#option-count');
  const initialState = new Map();
  search.addEventListener('input', () => {
    const terms = search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let visible = 0;
    for (const group of groups) {
      if (terms.length && !initialState.has(group)) initialState.set(group, group.open);
      let matches = 0;
      for (const row of group.querySelectorAll('.flag-entry')) {
        row.hidden = !terms.every(term => row.dataset.search.toLocaleLowerCase().includes(term));
        if (!row.hidden) matches++;
      }
      visible += matches;
      group.hidden = matches === 0;
      if (terms.length) group.open = matches > 0;
      else if (initialState.has(group)) group.open = initialState.get(group);
    }
    if (!terms.length) initialState.clear();
    count.textContent = ru ? `Параметров: ${visible} / ${options.length}` : `${visible} / ${options.length} options`;
  });
  count.textContent = ru ? `Все ${options.length} параметра · выбери категорию` : `All ${options.length} options · choose a category`;
  document.querySelector('.reference-search').hidden = false;
}
if (typeof document !== 'undefined') { initBuilder(); initReference(); }
