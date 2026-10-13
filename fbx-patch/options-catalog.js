export const optionGroups = [
  {
    "id": "general",
    "en": "Run and output",
    "ru": "Запуск и вывод"
  },
  {
    "id": "materials",
    "en": "Materials",
    "ru": "Материалы"
  },
  {
    "id": "textures",
    "en": "Textures and material pool",
    "ru": "Текстуры и пул материалов"
  },
  {
    "id": "uv",
    "en": "UV channels",
    "ru": "UV-каналы"
  },
  {
    "id": "colors",
    "en": "Vertex colors",
    "ru": "Вершинные цвета"
  },
  {
    "id": "collisions",
    "en": "Collisions",
    "ru": "Коллизии"
  },
  {
    "id": "shading",
    "en": "Normals, smoothing and tangents",
    "ru": "Нормали, сглаживание и тангенты"
  },
  {
    "id": "transforms",
    "en": "Units and transforms",
    "ru": "Единицы и трансформации"
  },
  {
    "id": "axes",
    "en": "Axes",
    "ru": "Оси"
  },
  {
    "id": "geometry",
    "en": "Geometry",
    "ru": "Геометрия"
  },
  {
    "id": "scene",
    "en": "Scene cleanup",
    "ru": "Очистка сцены"
  },
  {
    "id": "names",
    "en": "Names and source diagnostics",
    "ru": "Имена и диагностика источника"
  }
];

export const options = [
  {
    "flag": "--recursive",
    "group": "general",
    "kind": "control",
    "en": "Scan nested folders. Without it, directories are scanned at the top level only.",
    "ru": "Обходить вложенные папки. Без параметра сканируется только верхний уровень.",
    "aliases": [
      "-r"
    ],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--dry-run",
    "group": "general",
    "kind": "control",
    "en": "Preview enabled repairs without writing FBX files or backups. A report can still be written.",
    "ru": "Показать план выбранных исправлений без записи FBX и резервных копий. Отчёт может записываться.",
    "aliases": [
      "-n"
    ],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--inspect",
    "group": "general",
    "kind": "control",
    "en": "Print scene, mesh and material details. Always read-only; bypasses repairs, workers and the report-file pipeline.",
    "ru": "Показать содержимое сцены, мешей и материалов. Всегда только чтение; исправления, процессы и запись отчёта обходятся.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--report-file",
    "group": "general",
    "kind": "control",
    "en": "Write a UTF-8 report grouped by finding category. .md selects Markdown; other extensions select plain text. Overwrites an existing report.",
    "ru": "Записать UTF-8 отчёт по категориям проблем: .md — Markdown, другое расширение — обычный текст. Существующий отчёт перезаписывается.",
    "aliases": [],
    "requires": [],
    "argument": "PATH"
  },
  {
    "flag": "--jobs",
    "group": "general",
    "kind": "control",
    "en": "Limit parallel worker processes: one FBX per process. Default is CPU-based auto selection, capped at 64; -j 1 processes files sequentially.",
    "ru": "Число параллельных процессов: один FBX на процесс. По умолчанию — автоматически по CPU, максимум 64; -j 1 обрабатывает последовательно.",
    "aliases": [
      "-j"
    ],
    "requires": [],
    "argument": "N"
  },
  {
    "flag": "--verbose",
    "group": "general",
    "kind": "control",
    "en": "Print results for each file rather than only the summary. Parallel output can interleave.",
    "ru": "Показывать результат для каждого файла, а не только сводку. При параллельной обработке строки могут чередоваться.",
    "aliases": [
      "-v"
    ],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--short-paths",
    "group": "general",
    "kind": "display",
    "en": "Shorten displayed paths from the first Assets or Content directory. Input paths and files are not changed.",
    "ru": "Сократить пути в выводе начиная с первой папки Assets или Content. Входные пути и файлы не изменяются.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--no-backup",
    "group": "general",
    "kind": "control",
    "en": "Disable the default .fbx.bak backup during a rewrite. Does not make a repair read-only.",
    "ru": "Не создавать стандартную .fbx.bak при перезаписи. Это не превращает исправление в режим чтения.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--help",
    "group": "general",
    "kind": "info",
    "en": "Print the complete built-in help and exit with code 0. No input path is needed.",
    "ru": "Вывести полную встроенную справку и завершиться с кодом 0. Входной путь не нужен.",
    "aliases": [
      "-h"
    ],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--version",
    "group": "general",
    "kind": "info",
    "en": "Print tool and linked FBX SDK versions and exit. No input path is needed.",
    "ru": "Показать версии программы и встроенного FBX SDK и завершиться. Входной путь не нужен.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--apply-materials-patch",
    "group": "materials",
    "kind": "repair",
    "en": "Enable texture shading, fill empty relative texture paths and bind diffuse textures to UV0. These three repairs are off by default.",
    "ru": "Включить текстурный шейдинг, заполнить пустые относительные пути текстур и привязать diffuse к UV0. По умолчанию эти три исправления выключены.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--fix-mat-layers",
    "group": "materials",
    "kind": "repair",
    "en": "Repair render-mesh material layers: move a valid assignment to layer 0 and remove eNone placeholders. Geometry channels stay intact.",
    "ru": "Исправить слои материалов render-мешей: перенести корректное назначение в слой 0 и убрать заглушки eNone. Геометрические каналы сохраняются.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--upgrade-material-to-phong",
    "group": "materials",
    "kind": "repair",
    "en": "Convert Lambert or generic materials to Phong while keeping names, diffuse values and diffuse textures; zero specular/reflection.",
    "ru": "Преобразовать Lambert и общие материалы в Phong с сохранением имени, diffuse и его текстуры; specular/reflection обнуляются.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--create-default-material-from-pool",
    "group": "materials",
    "kind": "repair",
    "en": "Give render meshes with no material a Phong material based on the most frequent pool entry. Needs --material-pool and a usable donor in the input set.",
    "ru": "Создать Phong для render-мешей без материала на основе самой частой записи пула. Нужны --material-pool и подходящий материал-донор среди входных FBX.",
    "aliases": [],
    "requires": [
      "--material-pool"
    ],
    "argument": ""
  },
  {
    "flag": "--guess-textures",
    "group": "textures",
    "kind": "repair",
    "en": "Resolve missing diffuse connections from material names, e.g. M_Chair → T_Chair_Albedo. Search the FBX folder, nearby Textures folders, mirrored Meshes/Textures paths and the optional texture root.",
    "ru": "Найти отсутствующий diffuse по имени материала, например M_Chair → T_Chair_Albedo. Поиск в папке FBX, соседних Textures, зеркальных путях Meshes/Textures и указанном корне текстур.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--texture-root",
    "group": "textures",
    "kind": "control",
    "en": "Extra recursively indexed search root for --guess-textures. It supplements the search near each FBX.",
    "ru": "Дополнительная папка текстур с рекурсивным индексом для --guess-textures. Дополняет поиск рядом с FBX.",
    "aliases": [],
    "requires": [
      "--guess-textures"
    ],
    "argument": "PATH"
  },
  {
    "flag": "--rebind-missing-textures",
    "group": "textures",
    "kind": "repair",
    "en": "Also resolve existing diffuse connections whose file paths are broken. Needs --guess-textures; otherwise no rebinding is performed.",
    "ru": "Повторно найти diffuse для существующих подключений с нерабочими путями. Требует --guess-textures; без него перепривязка не выполняется.",
    "aliases": [],
    "requires": [
      "--guess-textures"
    ],
    "argument": ""
  },
  {
    "flag": "--material-pool",
    "group": "textures",
    "kind": "modifier",
    "en": "Survey all input FBX files first, selecting the most frequent diffuse texture per material name. Supplies --guess-textures or --create-default-material-from-pool; adds a survey pass.",
    "ru": "Сначала собрать пул из всех входных FBX: самая частая diffuse-текстура для каждого имени материала. Используется --guess-textures или --create-default-material-from-pool; добавляет проход анализа.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--debug-textures",
    "group": "textures",
    "kind": "diagnostic",
    "en": "Print candidate texture stems for unresolved materials. Needs --guess-textures; use Preview to inspect the lookup without saving.",
    "ru": "Печатать имена кандидатов для материалов без найденной текстуры. Требует --guess-textures; режим предпросмотра позволяет проверить поиск без записи.",
    "aliases": [],
    "requires": [
      "--guess-textures"
    ],
    "argument": ""
  },
  {
    "flag": "--clamp-uv1",
    "group": "uv",
    "kind": "repair",
    "en": "Clamp the second UV channel (FBX index 1) to [0, 1]. Discards tile coordinates outside that range; does not unwrap.",
    "ru": "Ограничить второй UV-канал (индекс FBX 1) диапазоном [0, 1]. Координаты вне диапазона теряются; развёртка не создаётся.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--clamp-uv2",
    "group": "uv",
    "kind": "repair",
    "en": "Clamp the third UV channel (FBX index 2) to [0, 1]. Does not unwrap or pack islands.",
    "ru": "Ограничить третий UV-канал (индекс FBX 2) диапазоном [0, 1]. Не создаёт развёртку и не пакует острова.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--fill-missing-uv1",
    "group": "uv",
    "kind": "repair",
    "en": "Add a missing second UV channel with constant (1, 1) values on render meshes. This is deterministic shader data, not lightmap UV generation.",
    "ru": "Добавить render-мешам отсутствующий второй UV-канал с постоянным (1, 1). Это данные для шейдера, а не генерация lightmap-развёртки.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--fill-missing-uv2",
    "group": "uv",
    "kind": "repair",
    "en": "Add a missing third UV channel with constant (1, 1) values on render meshes. Existing UV2 is preserved.",
    "ru": "Добавить render-мешам отсутствующий третий UV-канал с постоянным (1, 1). Существующий UV2 сохраняется.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--uv2-y-zero",
    "group": "uv",
    "kind": "modifier",
    "en": "Use (1, 0) instead of (1, 1) when --fill-missing-uv2 creates a channel. Does not change existing UV2 values.",
    "ru": "При создании канала через --fill-missing-uv2 использовать (1, 0) вместо (1, 1). Существующий UV2 не меняется.",
    "aliases": [],
    "requires": [
      "--fill-missing-uv2"
    ],
    "argument": ""
  },
  {
    "flag": "--strip-broken-uv-layers",
    "group": "uv",
    "kind": "repair",
    "en": "Detach empty or invalid UV elements/index tables. Runs before missing-UV fill; also affects collision meshes.",
    "ru": "Убрать пустые или повреждённые UV-элементы и таблицы индексов. Выполняется до заполнения отсутствующих UV; действует и на коллизии.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--fill-missing-vcolor",
    "group": "colors",
    "kind": "repair",
    "en": "Add missing vertex colors as opaque white RGBA (1, 1, 1, 1).",
    "ru": "Заполнить отсутствующие вершинные цвета белым непрозрачным RGBA (1, 1, 1, 1).",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--clamp-vcolor",
    "group": "colors",
    "kind": "repair",
    "en": "Clamp existing vertex color RGBA values to [0, 1].",
    "ru": "Ограничить существующие компоненты RGBA вершинных цветов диапазоном [0, 1].",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--strip-extra-vcolor-layers",
    "group": "colors",
    "kind": "repair",
    "en": "Keep one vertex-color layer on render meshes. If layer 0 is empty, preserve the first non-empty higher layer before removing extras.",
    "ru": "Оставить один слой вершинных цветов на render-мешах. Если слой 0 пуст, сначала сохранить в нём первый непустой верхний слой, затем убрать лишние.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--strip-col-data",
    "group": "collisions",
    "kind": "repair",
    "en": "Remove UV and vertex-color data from collision meshes. Shared render-mesh data is preserved. Does not remove collider geometry.",
    "ru": "Убрать UV и вершинные цвета коллизий. Данные, общие с render-мешами, сохраняются. Геометрия коллизий не удаляется.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--strip-col-mat-layers",
    "group": "collisions",
    "kind": "repair",
    "en": "Repair malformed material-layer placeholders specifically on collision meshes, which --fix-mat-layers skips.",
    "ru": "Исправить повреждённые заглушки слоёв материалов именно на коллизиях, которые пропускает --fix-mat-layers.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--replace-col-placeholder-materials",
    "group": "collisions",
    "kind": "repair",
    "en": "Replace Lit/Default/Material collider placeholders with a render-mesh donor from the same FBX. Leaves them unchanged when no suitable donor exists.",
    "ru": "Заменить заглушки Lit/Default/Material коллизий материалом render-меша из того же FBX. Без подходящего донора замена не выполняется.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--detect-broken-normals",
    "group": "shading",
    "kind": "diagnostic",
    "en": "Report render meshes with missing, non-finite or near-zero normals. Does not rebuild them.",
    "ru": "Найти отсутствующие, нечисловые или почти нулевые нормали render-мешей. Не перестраивает их.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--detect-missing-smoothing",
    "group": "shading",
    "kind": "diagnostic",
    "en": "Report missing layer-0 smoothing data or all-zero groups (every edge hard).",
    "ru": "Найти отсутствие сглаживания в слое 0 или полностью нулевые группы, где все рёбра жёсткие.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--detect-faceted-normals",
    "group": "shading",
    "kind": "diagnostic",
    "en": "Compare stored corner normals with geometric face normals and report faceted shading. Does not change intended hard edges.",
    "ru": "Сравнить нормали углов с геометрическими нормалями граней и выявить плоское сглаживание. Задуманные жёсткие рёбра не меняет.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--detect-broken-tbn",
    "group": "shading",
    "kind": "diagnostic",
    "en": "Report render meshes with explicit tangents and mixed UV winding, a possible mirrored-UV handedness problem. Not a general tangent validator.",
    "ru": "Найти render-меши с явными тангентами и смешанным направлением UV — возможную проблему знака на зеркальных островах. Это не общая проверка всех тангентов.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--strip-tangents-binormals",
    "group": "shading",
    "kind": "repair",
    "en": "Remove all tangent and binormal layers so the importer can rebuild them. Normals, smoothing and UVs are preserved.",
    "ru": "Удалить слои тангентов и бинормалей для пересчёта при импорте. Нормали, сглаживание и UV сохраняются.",
    "aliases": [
      "--strip-tbn"
    ],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--bake-tangents",
    "group": "shading",
    "kind": "repair",
    "en": "Generate fresh FBX SDK tangents/binormals from UV0 with ignoreTangentFlip=true; skip collisions. Strip runs first when both flags are selected. In Unity choose Tangents: Import to use them.",
    "ru": "Создать тангенты/бинормали FBX SDK по UV0 с ignoreTangentFlip=true; коллизии пропускаются. При совместном выборе удаление выполняется раньше. В Unity использовать Tangents: Import.",
    "aliases": [
      "--bake-tbn"
    ],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--rebuild-normals-from-smoothing",
    "group": "shading",
    "kind": "repair",
    "en": "Regenerate render-mesh corner normals from existing polygon smoothing groups. Does nothing where no smoothing layer exists.",
    "ru": "Пересчитать нормали углов render-мешей по существующим группам сглаживания полигонов. Без слоя сглаживания не работает.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--rebuild-shading",
    "group": "shading",
    "kind": "repair",
    "en": "Use valid smoothing groups, or derive them from matching existing corner normals; then regenerate normals. Needs usable smoothing or normal data.",
    "ru": "Использовать корректные группы сглаживания либо восстановить их по совпадающим нормалям углов, затем пересчитать нормали. Нужны пригодные данные сглаживания или нормалей.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--rebuild-shading-from-uv",
    "group": "shading",
    "kind": "repair",
    "en": "Derive smoothing from UV0 islands: UV seams become hard boundaries, then normals are regenerated. Use only when UV seams match intended shading seams.",
    "ru": "Восстановить сглаживание по островам UV0: UV-швы становятся жёсткими границами, затем пересчитываются нормали. Подходит, когда UV-швы соответствуют задуманным границам сглаживания.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--fix-normal-w",
    "group": "shading",
    "kind": "repair",
    "en": "Set the homogeneous W component of normal entries to 0. Does not rebuild normal XYZ components.",
    "ru": "Обнулить однородную компоненту W у нормалей. Компоненты XYZ не пересчитываются.",
    "aliases": [
      "--zero-normal-w"
    ],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--convert-to-meters",
    "group": "transforms",
    "kind": "repair",
    "en": "Convert scene system units to meters via the FBX SDK. Pair with scale baking when you also want identity node scales.",
    "ru": "Перевести системные единицы сцены в метры через FBX SDK. Для единичного масштаба узлов можно дополнить запеканием scale.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--bake-non-identity-scale",
    "group": "transforms",
    "kind": "repair",
    "en": "Bake accumulated node scales into vertices/child translations and reset local scales to (1, 1, 1). Non-uniform ancestor scale combined with rotation can introduce shear; pivots and Geometric* are not baked.",
    "ru": "Запечь накопленный scale в вершины и позиции детей, сбросить локальный scale в (1, 1, 1). Неравномерный scale родителей с поворотом может дать сдвиг формы; pivot и Geometric* не запекаются.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--bake-geometric-transforms",
    "group": "transforms",
    "kind": "repair",
    "en": "Bake FBX GeometricTranslation/Rotation/Scaling into mesh control points, then reset these properties. This is separate from node local transforms.",
    "ru": "Запечь FBX GeometricTranslation/Rotation/Scaling в вершины меша и сбросить эти свойства. Это отдельная операция от локального Transform узла.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--detect-negative-scale",
    "group": "transforms",
    "kind": "diagnostic",
    "en": "Report accumulated scales with negative determinant: an odd number of flipped axes. Does not fix polygon winding.",
    "ru": "Найти накопленный scale с отрицательным определителем: нечётное число перевёрнутых осей. Порядок вершин полигонов не исправляет.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--detect-broken-axis",
    "group": "axes",
    "kind": "diagnostic",
    "en": "Audit scene axis/unit header and missing axis-conversion stamps. Reports suspicious metadata; does not convert the scene.",
    "ru": "Проверить заголовок осей/единиц и отсутствующие отметки конвертации. Сообщает о подозрительных метаданных, но не конвертирует сцену.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--detect-axis-mismatch",
    "group": "axes",
    "kind": "diagnostic",
    "en": "Compare geometric face normals and stored normals on render meshes to flag possible coordinate-system disagreement. A heuristic, not proof of the source axes.",
    "ru": "Сравнить геометрические и записанные нормали render-мешей для поиска несогласованности координат. Это эвристика, а не доказательство исходной системы осей.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--fix-axis-system",
    "group": "axes",
    "kind": "repair",
    "en": "Correct supported axis-header/data problems and convert to Y-up. Automatically enables both axis audits. Changes transforms, vertices and normals; inspect the preview carefully.",
    "ru": "Исправить поддерживаемые ошибки заголовка/данных осей и привести к Y-up. Автоматически включает обе проверки осей. Меняет трансформации, вершины и нормали; внимательно проверить предпросмотр.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--remove-orphan-vertices",
    "group": "geometry",
    "kind": "repair",
    "en": "Remove vertices unused by any polygon and remap affected control-point layer data.",
    "ru": "Удалить вершины, не используемые полигонами, и перенумеровать затронутые данные слоёв.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--remove-degenerate-polys",
    "group": "geometry",
    "kind": "repair",
    "en": "Remove invalid polygons with too few or repeated vertices and zero-area triangles.",
    "ru": "Удалить некорректные полигоны с недостатком/повтором вершин и треугольники нулевой площади.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--strip-empty-meshes",
    "group": "geometry",
    "kind": "repair",
    "en": "Remove nodes whose mesh has zero control points or zero polygons.",
    "ru": "Удалить узлы, у которых меш не содержит вершин или полигонов.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--strip-animation",
    "group": "scene",
    "kind": "repair",
    "en": "Remove animation stacks, layers, curve nodes and curves. Intended for static-model cleanup; animation is discarded.",
    "ru": "Удалить стеки, слои, узлы кривых и кривые анимации. Очистка статичных моделей; анимация теряется.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--strip-embedded-media",
    "group": "scene",
    "kind": "repair",
    "en": "Clear embedded texture bytes from FBX videos. Keep external textures available for reimport.",
    "ru": "Удалить встроенные байты текстур из FBX. Для импорта сохранить доступные внешние текстуры.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--strip-non-mesh-nodes",
    "group": "scene",
    "kind": "repair",
    "en": "Remove cameras, lights, skeletons and other non-mesh attributes; retain mesh/null hierarchy. Suitable for static props, not a skinned-animation cleanup preset.",
    "ru": "Удалить камеры, свет, скелеты и другие не-мешевые атрибуты; сохранить иерархию mesh/null. Подходит статичным моделям, а не как набор очистки анимированных скелетов.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--strip-hidden-nodes",
    "group": "scene",
    "kind": "repair",
    "en": "Remove nodes hidden by their FBX Visibility property, while keeping hidden collision nodes.",
    "ru": "Удалить узлы, скрытые свойством FBX Visibility. Скрытые коллизии сохраняются.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--strip-empty-dummies",
    "group": "scene",
    "kind": "repair",
    "en": "Remove leaf null/dummy nodes with no children and identity transform. Keep non-empty groups and transformed helpers.",
    "ru": "Удалить конечные null/dummy без детей с единичным Transform. Непустые группы и трансформированные хелперы сохраняются.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--restore-mesh-names-from-node",
    "group": "names",
    "kind": "repair",
    "en": "Replace generic mesh-attribute names (Scene, Geometry, Mesh, etc.) with the owning node name. Does not rename the node itself.",
    "ru": "Заменить общие имена атрибутов мешей (Scene, Geometry, Mesh и т. п.) именем владеющего узла. Сам узел не переименовывается.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--restore-texture-names-from-file",
    "group": "names",
    "kind": "repair",
    "en": "Replace default texture-object labels such as DiffuseColor_Texture with the referenced filename stem. Does not rename texture files.",
    "ru": "Заменить стандартные имена объектов текстур вроде DiffuseColor_Texture именем файла без расширения. Файлы текстур не переименовываются.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--detect-non-ascii-names",
    "group": "names",
    "kind": "diagnostic",
    "en": "Report Cyrillic/CJK names, Windows-illegal characters and controls in names, channel labels and texture paths. A pipeline compatibility check, not a quality judgement.",
    "ru": "Найти кириллицу/CJK, недопустимые для Windows и управляющие символы в именах, каналах и путях текстур. Проверка совместимости пайплайна, а не качества имён.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--detect-modified",
    "group": "names",
    "kind": "diagnostic",
    "en": "Flag missing/empty scene application metadata as a possible re-save. Does not prove a file was edited.",
    "ru": "Отметить пустые/отсутствующие метаданные приложения как возможное пересохранение. Не доказывает факт редактирования.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--detect-unity-modified",
    "group": "names",
    "kind": "diagnostic",
    "en": "Report Unity in the original or last-saving application/vendor metadata.",
    "ru": "Найти Unity в метаданных исходного или последнего сохранявшего приложения/производителя.",
    "aliases": [],
    "requires": [],
    "argument": ""
  },
  {
    "flag": "--classify-source",
    "group": "names",
    "kind": "diagnostic",
    "en": "Group files by source metadata: empty, Blender, stock Max/Maya, Unity FBX, custom Max SDK or other named source. Adds SOURCE-* report categories.",
    "ru": "Сгруппировать по метаданным источника: пусто, Blender, стандартные Max/Maya, Unity FBX, собственный Max SDK или другое приложение. Добавляет категории SOURCE-* в отчёт.",
    "aliases": [],
    "requires": [],
    "argument": ""
  }
];
