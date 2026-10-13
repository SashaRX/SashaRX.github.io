export const repairFlags = {
  collisions: ['--strip-col-data'],
  tangents: ['--strip-tbn'],
  materials: ['--apply-materials-patch', '--fix-mat-layers'],
  textures: ['--guess-textures'],
  units: ['--convert-to-meters', '--bake-non-identity-scale'],
  colors: ['--fill-missing-vcolor', '--clamp-vcolor'],
  geometry: ['--remove-orphan-vertices', '--remove-degenerate-polys'],
  lightmap: ['--clamp-uv1']
};
const diagnostics = [
  '--detect-broken-normals', '--detect-missing-smoothing', '--detect-broken-tbn',
  '--detect-negative-scale', '--detect-broken-axis', '--detect-axis-mismatch'
];

function pathValue(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) return trimmed.slice(1, -1);
  return trimmed;
}
function validPath(value) {
  return !/^[\-]/.test(value) && !/["\u0000-\u001f\u007f]/.test(value);
}
function quote(value) {
  // PowerShell literal strings preserve $, backticks, spaces and apostrophes.
  return `'${value.replaceAll("'", "''")}'`;
}

export function buildCommand(config) {
  const paths = [...new Set(config.paths.split(/\r\n|\r|\n/).map(pathValue).filter(Boolean))];
  if (!paths.length) return { error: 'paths' };
  const report = pathValue(config.report || '');
  const textureRoot = pathValue(config.textureRoot || '');
  if (paths.some(path => !validPath(path))) return { error: 'invalidPaths' };
  if (!['audit', 'inspect', 'preview', 'apply'].includes(config.mode)) return { error: 'mode' };

  const inspect = config.mode === 'inspect';
  const repair = config.mode === 'preview' || config.mode === 'apply';
  const patches = [...new Set(config.patches || [])];
  if (repair && (!patches.length || patches.some(key => !Object.hasOwn(repairFlags, key)))) {
    return { error: 'patches' };
  }
  const jobs = Number(config.jobs);
  if (!inspect && (!Number.isInteger(jobs) || jobs < 1 || jobs > 64)) return { error: 'jobs' };
  if (!inspect && report && !validPath(report)) return { error: 'report' };
  if (repair && patches.includes('textures') && textureRoot && !validPath(textureRoot)) {
    return { error: 'textureRoot' };
  }

  const flags = [];
  if (inspect) flags.push('--inspect');
  if (config.mode === 'preview') flags.push('-n');
  if (config.recursive) flags.push('-r');
  if (!inspect) {
    flags.push('-j', String(jobs));
    if (config.verbose) flags.push('-v');
    if (config.diagnostics) flags.push(...diagnostics);
    if (repair) flags.push(...patches.flatMap(key => repairFlags[key]));
  }
  const args = [...flags];
  const command = ['.\\patch_fbx.exe', ...flags];
  if (repair && patches.includes('textures') && textureRoot) {
    args.push('--texture-root', textureRoot);
    command.push('--texture-root', quote(textureRoot));
  }
  if (!inspect && report) {
    args.push('--report-file', report);
    command.push('--report-file', quote(report));
  }
  args.push(...paths);
  command.push(...paths.map(quote));
  return { command: command.join(' '), args, inputs: paths.length, repairs: repair ? patches.length : 0 };
}

function initBuilder() {
  const form = document.querySelector('#command-builder');
  if (!form) return;
  const ru = document.documentElement.lang === 'ru';
  const text = ru ? {
    paths: 'Укажи хотя бы одну папку или FBX — каждый путь с новой строки.',
    invalidPaths: 'Проверь пути: без управляющих символов и кавычек внутри. Для имени, начинающегося с «-», добавь .\\ или полный путь.',
    mode: 'Выбери режим обработки.', patches: 'Выбери хотя бы одно исправление справа или готовый набор.',
    jobs: 'Число процессов должно быть целым: от 1 до 64.',
    report: 'Проверь путь к отчёту.', textureRoot: 'Проверь путь к папке текстур.',
    copied: 'Команда скопирована.', manual: 'Команда выделена — нажми Ctrl+C для копирования.',
    audit: 'Только проверка и отчёт. Исходные FBX не меняются.',
    inspect: 'Подробные данные мешей и материалов в консоли. Без исправлений и файла отчёта.',
    preview: 'Показать планируемые изменения. FBX и резервные копии не записываются.',
    apply: 'Перезаписывает FBX с копией .fbx.bak. В 1.0.0 запись может завершиться известной ошибкой; пока рекомендуется аудит или предпросмотр.',
    ready: count => `Готово · путей: ${count}. Запусти в PowerShell из папки с patch_fbx.exe.`
  } : {
    paths: 'Enter at least one folder or FBX file, one path per line.',
    invalidPaths: 'Check paths: no control characters or quotes inside. Prefix names starting with “-” with .\\ or use a full path.',
    mode: 'Choose an operation.', patches: 'Select at least one repair on the right, or choose a preset.',
    jobs: 'Worker count must be a whole number from 1 to 64.',
    report: 'Check the report path.', textureRoot: 'Check the texture folder path.',
    copied: 'Command copied.', manual: 'Command selected — press Ctrl+C to copy.',
    audit: 'Scan and report only. Original FBX files stay unchanged.',
    inspect: 'Detailed mesh and material data in the console. No repairs or report file.',
    preview: 'Show proposed changes. No FBX writes or backups.',
    apply: 'Rewrites FBX with a .fbx.bak backup. Saving can fail in 1.0.0 due to the known issue; audit or preview is recommended for now.',
    ready: count => `Ready · ${count} input path(s). Run in PowerShell beside patch_fbx.exe.`
  };
  const fields = form.elements;
  const output = form.querySelector('#generated-command');
  const status = form.querySelector('#builder-status');
  const modeHelp = form.querySelector('#mode-help');
  const patchGroup = form.querySelector('#repair-options');
  const copyButton = form.querySelector('#copy-command');
  const textureField = form.querySelector('#texture-field');
  const checkboxes = [...form.querySelectorAll('[name="patch"]')];

  function update() {
    const mode = fields.mode.value;
    const repair = mode === 'preview' || mode === 'apply';
    patchGroup.disabled = !repair;
    fields.report.disabled = fields.jobs.disabled = fields.verbose.disabled = fields.diagnostics.disabled = mode === 'inspect';
    const usesTextures = repair && checkboxes.some(box => box.value === 'textures' && box.checked);
    textureField.hidden = !usesTextures;
    fields.textureRoot.disabled = !usesTextures;
    modeHelp.textContent = text[mode];
    modeHelp.classList.toggle('apply-notice', mode === 'apply');
    const result = buildCommand({
      mode, paths: fields.paths.value, recursive: fields.recursive.checked,
      verbose: fields.verbose.checked, diagnostics: fields.diagnostics.checked,
      report: fields.report.value, jobs: fields.jobs.value,
      patches: checkboxes.filter(box => box.checked).map(box => box.value),
      textureRoot: fields.textureRoot.value
    });
    output.value = result.command || '';
    copyButton.disabled = !!result.error;
    status.textContent = result.error ? text[result.error] : text.ready(result.inputs);
  }

  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  const presets = {
    cleanup: ['collisions', 'tangents', 'geometry'],
    materials: ['materials', 'textures'],
    units: ['units'],
    reset: []
  };
  for (const button of form.querySelectorAll('[data-preset]')) {
    button.addEventListener('click', () => {
      const selected = presets[button.dataset.preset];
      fields.mode.value = selected.length ? 'preview' : 'audit';
      checkboxes.forEach(box => { box.checked = selected.includes(box.value); });
      update();
    });
  }
  copyButton.addEventListener('click', async () => {
    // Freeze the command being copied even if inputs change while permission is pending.
    const command = output.value;
    try {
      await navigator.clipboard.writeText(command);
      if (output.value === command) status.textContent = text.copied;
    } catch {
      if (output.value !== command) return;
      output.focus();
      output.select();
      status.textContent = text.manual;
    }
  });
  update();
  form.hidden = false;
}

if (typeof document !== 'undefined') initBuilder();
