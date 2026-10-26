# FBX Patch Tool 1.1.1

Complete Windows x64 command reference. No Max, Unity or Qt installation is needed.

Audit and repair existing FBX libraries: materials, textures, UVs, vertex colors, collisions, normals, smoothing, units, axes, geometry and metadata. Process multiple files and folders in one run.

Download: https://github.com/SashaRX/MaxModelBatch-Releases/releases/tag/patch-fbx-v1.1.1

## Quick start

Extract the ZIP and open PowerShell beside patch_fbx.exe. This is a console program. Quote paths containing spaces; Unicode paths are supported.

```powershell
.\patch_fbx.exe --version
.\patch_fbx.exe --help
.\patch_fbx.exe -r -v --report-file audit.md "D:\Models"
.\patch_fbx.exe --inspect "D:\Models\SM_Chair.fbx"
.\patch_fbx.exe -n -r --strip-tbn --strip-col-data "D:\Models"
```

Without repair flags the tool only audits. -n previews repairs without FBX/backup writes; --inspect always reads only. --report-file can write a report during a dry run.


Shared diffuse textures used by meshes with different UV0 names are reported as UVSET-CONFLICT. Their UVSet is preserved; rename the source UV0 channels consistently or use separate texture/material bindings before retrying that repair.

## All 65 user-facing options

### Run and output

| Option | Behavior |
|---|---|
| `--recursive` / `-r` | Scan nested folders. Without it, directories are scanned at the top level only. |
| `--dry-run` / `-n` | Preview enabled repairs without writing FBX files or backups. A report can still be written. |
| `--inspect` | Print scene, mesh and material details. Always read-only; bypasses repairs, workers and the report-file pipeline. |
| `--report-file PATH` | Write a UTF-8 report grouped by finding category. .md selects Markdown; other extensions select plain text. Overwrites an existing report. |
| `--jobs N` / `-j` | Limit parallel worker processes: one FBX per process. Default is CPU-based auto selection, capped at 64; -j 1 processes files sequentially. |
| `--verbose` / `-v` | Print results for each file rather than only the summary. Parallel output can interleave. |
| `--short-paths` | Shorten displayed paths from the first Assets or Content directory. Input paths and files are not changed. |
| `--no-backup` | Disable the default .fbx.bak backup during a rewrite. Does not make a repair read-only. |
| `--help` / `-h` | Print the complete built-in help and exit with code 0. No input path is needed. |
| `--version` | Print tool and linked FBX SDK versions and exit. No input path is needed. |

### Materials

| Option | Behavior |
|---|---|
| `--apply-materials-patch` | Enable render-mesh texture shading, fill empty relative texture paths and bind diffuse textures to UV0. Conflicting shared UV bindings are reported and preserved. These repairs are off by default. |
| `--fix-mat-layers` | Repair render-mesh material layers: move a valid assignment to layer 0 and remove eNone placeholders. Geometry channels stay intact. |
| `--upgrade-material-to-phong` | Convert Lambert or generic materials to Phong while keeping names, diffuse values and diffuse textures; zero specular/reflection. |
| `--create-default-material-from-pool` | Give render meshes with no material a Phong material based on the most frequent pool entry. Needs --material-pool and a usable donor in the input set. |

### Textures and material pool

| Option | Behavior |
|---|---|
| `--guess-textures` | Resolve missing diffuse connections from material names, e.g. M_Chair → T_Chair_Albedo. Search the FBX folder, nearby Textures folders, mirrored Meshes/Textures paths and the optional texture root. |
| `--texture-root PATH` | Extra recursively indexed search root for --guess-textures. It supplements the search near each FBX. |
| `--rebind-missing-textures` | Also resolve existing diffuse connections whose file paths are broken. Needs --guess-textures; otherwise no rebinding is performed. |
| `--material-pool` | Survey all input FBX files first, selecting the most frequent diffuse texture per material name. Supplies --guess-textures or --create-default-material-from-pool; adds a survey pass. |
| `--debug-textures` | Print candidate texture stems for unresolved materials. Needs --guess-textures; use Preview to inspect the lookup without saving. |

### UV channels

| Option | Behavior |
|---|---|
| `--clamp-uv1` | Clamp the second UV channel (FBX index 1) to [0, 1]. Discards tile coordinates outside that range; does not unwrap. |
| `--clamp-uv2` | Clamp the third UV channel (FBX index 2) to [0, 1]. Does not unwrap or pack islands. |
| `--fill-missing-uv1` | Add a missing second UV channel with constant (1, 1) values on render meshes. This is deterministic shader data, not lightmap UV generation. |
| `--fill-missing-uv2` | Add a missing third UV channel with constant (1, 1) values on render meshes. Existing UV2 is preserved. |
| `--uv2-y-zero` | Use (1, 0) instead of (1, 1) when --fill-missing-uv2 creates a channel. Does not change existing UV2 values. |
| `--strip-broken-uv-layers` | Detach empty or invalid UV elements/index tables. Runs before missing-UV fill; also affects collision meshes. |

### Vertex colors

| Option | Behavior |
|---|---|
| `--fill-missing-vcolor` | Add missing vertex colors as opaque white RGBA (1, 1, 1, 1). |
| `--clamp-vcolor` | Clamp existing vertex color RGBA values to [0, 1]. |
| `--strip-extra-vcolor-layers` | Keep one vertex-color layer on render meshes. If layer 0 is empty, preserve the first non-empty higher layer before removing extras. |

### Collisions

| Option | Behavior |
|---|---|
| `--strip-col-data` | Remove UV and vertex-color data from collision meshes. Shared render-mesh data is preserved. Does not remove collider geometry. |
| `--strip-col-mat-layers` | Repair malformed material-layer placeholders specifically on collision meshes, which --fix-mat-layers skips. |
| `--replace-col-placeholder-materials` | Replace Lit/Default/Material collider placeholders with a render-mesh donor from the same FBX. Leaves them unchanged when no suitable donor exists. |

### Normals, smoothing and tangents

| Option | Behavior |
|---|---|
| `--detect-broken-normals` | Report render meshes with missing, non-finite or near-zero normals. Does not rebuild them. |
| `--detect-missing-smoothing` | Report missing layer-0 smoothing data or all-zero groups (every edge hard). |
| `--detect-faceted-normals` | Compare stored corner normals with geometric face normals and report faceted shading. Does not change intended hard edges. |
| `--detect-broken-tbn` | Report render meshes with explicit tangents and mixed UV winding, a possible mirrored-UV handedness problem. Not a general tangent validator. |
| `--strip-tangents-binormals` / `--strip-tbn` | Remove all tangent and binormal layers so the importer can rebuild them. Normals, smoothing and UVs are preserved. |
| `--bake-tangents` / `--bake-tbn` | Generate fresh FBX SDK tangents/binormals from UV0 with ignoreTangentFlip=true; skip collisions. Strip runs first when both flags are selected. In Unity choose Tangents: Import to use them. |
| `--rebuild-normals-from-smoothing` | Regenerate render-mesh corner normals from existing polygon smoothing groups. Does nothing where no smoothing layer exists. |
| `--rebuild-shading` | Use valid smoothing groups, or derive them from matching existing corner normals; then regenerate normals. Needs usable smoothing or normal data. |
| `--rebuild-shading-from-uv` | Derive smoothing from UV0 islands: UV seams become hard boundaries, then normals are regenerated. Use only when UV seams match intended shading seams. |
| `--fix-normal-w` / `--zero-normal-w` | Set the homogeneous W component of normal entries to 0. Does not rebuild normal XYZ components. |

### Units and transforms

| Option | Behavior |
|---|---|
| `--convert-to-meters` | Convert scene system units to meters via the FBX SDK. Pair with scale baking when you also want identity node scales. |
| `--bake-non-identity-scale` | Bake accumulated node scales into vertices/child translations and reset local scales to (1, 1, 1). Non-uniform ancestor scale combined with rotation can introduce shear; pivots and Geometric* are not baked. |
| `--bake-geometric-transforms` | Bake FBX GeometricTranslation/Rotation/Scaling into mesh control points, then reset these properties. This is separate from node local transforms. |
| `--detect-negative-scale` | Report accumulated scales with negative determinant: an odd number of flipped axes. Does not fix polygon winding. |

### Axes

| Option | Behavior |
|---|---|
| `--detect-broken-axis` | Audit scene axis/unit header and missing axis-conversion stamps. Reports suspicious metadata; does not convert the scene. |
| `--detect-axis-mismatch` | Compare geometric face normals and stored normals on render meshes to flag possible coordinate-system disagreement. A heuristic, not proof of the source axes. |
| `--fix-axis-system` | Correct supported axis-header/data problems and convert to Y-up. Automatically enables both axis audits. Changes transforms, vertices and normals; inspect the preview carefully. |

### Geometry

| Option | Behavior |
|---|---|
| `--remove-orphan-vertices` | Remove vertices unused by any polygon and remap affected control-point layer data. |
| `--remove-degenerate-polys` | Remove invalid polygons with too few or repeated vertices and zero-area triangles. |
| `--strip-empty-meshes` | Remove nodes whose mesh has zero control points or zero polygons. |

### Scene cleanup

| Option | Behavior |
|---|---|
| `--strip-animation` | Remove animation stacks, layers, curve nodes and curves. Intended for static-model cleanup; animation is discarded. |
| `--strip-embedded-media` | Clear embedded texture bytes from FBX videos. Keep external textures available for reimport. |
| `--strip-non-mesh-nodes` | Remove cameras, lights, skeletons and other non-mesh attributes; retain mesh/null hierarchy. Suitable for static props, not a skinned-animation cleanup preset. |
| `--strip-hidden-nodes` | Remove nodes hidden by their FBX Visibility property, while keeping hidden collision nodes. |
| `--strip-empty-dummies` | Remove leaf null/dummy nodes with no children and identity transform. Keep non-empty groups and transformed helpers. |

### Names and source diagnostics

| Option | Behavior |
|---|---|
| `--restore-mesh-names-from-node` | Replace generic mesh-attribute names (Scene, Geometry, Mesh, etc.) with the owning node name. Does not rename the node itself. |
| `--restore-texture-names-from-file` | Replace default texture-object labels such as DiffuseColor_Texture with the referenced filename stem. Does not rename texture files. |
| `--detect-non-ascii-names` | Report Cyrillic/CJK names, Windows-illegal characters and controls in names, channel labels and texture paths. A pipeline compatibility check, not a quality judgement. |
| `--detect-modified` | Flag missing/empty scene application metadata as a possible re-save. Does not prove a file was edited. |
| `--detect-unity-modified` | Report Unity in the original or last-saving application/vendor metadata. |
| `--classify-source` | Group files by source metadata: empty, Blender, stock Max/Maya, Unity FBX, custom Max SDK or other named source. Adds SOURCE-* report categories. |

### Strict modes

Opt-in and independent; any combination of the three is allowed. They cannot be combined with legacy repair flags (exit code 1). See "Strict modes in detail" below.

| Option | Behavior |
|---|---|
| `--normalize-render-channels` | On render meshes (not _COL, not shared with a _COL node) add each missing UV0/UV1/UV2 on its own layer, filled with (0, 0), (0, 0) and (1, 0); a missing UV1 next to an authored UV0 is an exact copy of UV0 instead, because Unity lightmaps a mesh without TexCoord1 through TexCoord0. Add opaque white colour on layer 0 when no layer has one. Remove UVs on layers ≥ 3, and extra colours when layer 0 holds a valid one. A damaged UV0–UV2 or layer-0 colour is an error: the whole file is left untouched and the run exits 2. Ambiguous layouts are reported and the mesh is skipped. Existing valid channels are never rewritten. |
| `--restore-missing-smoothing` | On render meshes with no smoothing element, derive 3ds Max smoothing groups that reproduce the authored normals exactly (1e-5 equality, not an angle) and write them on layer 0. Faceted faces get distinct non-zero groups; only when more than 32 bits would be needed do isolated faceted faces fall back to group 0. A split that groups cannot express, or a mesh with damaged UV0–UV2/colour, is reported and skipped. Normals and tangents are never changed. |
| `--clean-col-geometry` | On _COL meshes remove UVs, vertex colours, normals, tangents, binormals, smoothing and material elements, and disconnect the node's materials without destroying them. Geometry, names and transforms are kept. Shared or deformed _COL meshes are reported and skipped. |

## Strict modes in detail

**Channel names.** UV0/UV1/UV2 are FBX layers 0/1/2, which Unity imports as TexCoord0/1/2 (`Mesh.uv`, `Mesh.uv2`, `Mesh.uv3`). The tool's UV2 is not Unity's `Mesh.uv2`, which is TexCoord1, the tool's UV1.

**--normalize-render-channels.**
- Missing UV0 is added as (0, 0); missing UV2 as (1, 0), by-polygon-vertex / index-to-direct. Missing UV1 copies authored UV0 exactly, including mapping, reference mode, values and indices. If UV0 is also missing, the new UV1 uses (0, 0).
- The added UV is named `UVChannel_{k+1}` unless the mesh already has a UV set with that name. 3ds Max exports map channels 1 and 3 as `UVChannel_1` and `UVChannel_3`, so an added UV2 then becomes `UVChannel_4` (one past the highest existing `UVChannel_<n>`). Duplicate names would make Max overwrite one channel on re-import. The report's `uvnames=` shows the names used.
- A mesh with no colour gets white (1, 1, 1, 1) on layer 0.
- The main colour is a valid layer-0 colour; colours on other layers are then removed. Colour only on higher layers is ambiguous: the mesh is skipped (CHANNEL-AMBIGUOUS).
- Diffuse UVs on layers 3 and up are removed.
- Damaged is not missing, and it is an error. A UV0–UV2 or layer-0 colour element with an unsupported mapping or reference (including legacy eIndex), an empty or short value array, a wrong index count, an out-of-range index or NaN/Inf values is never replaced. It is reported (CHANNEL-DAMAGED) and the whole file is left untouched: no mesh in it is rewritten, no backup is made, an ERROR row is written and the run exits 2. A dry run reports the same error. Values outside [0, 1] are not damage; damage on UV3+ or on a colour that would be removed does not block.
- A UV gap (e.g. UV0 + UV2 only), a UV in a non-diffuse slot, or UV0–UV2 element order differing from layer order skips the mesh (CHANNEL-AMBIGUOUS, not an error). Only layers 0–2 are compared for element order, since higher UVs are removed.

**--restore-missing-smoothing.**
- Runs only when the mesh has no smoothing element and exactly one valid normal element mapped by polygon-vertex or by control point. By control point means all manifold edges are soft.
- An edge is soft only when both faces carry equal normals at both ends. Equal means 1e-5 per component after normalisation: a float round-trip tolerance, not an angle threshold.
- The groups are verified against a simulation of Max's smoothing rule. A seam, a hard edge ending inside a smooth region, a non-manifold or inconsistently wound edge, or more than 32 groups gives SMOOTHING-UNREPRESENTABLE and no change. It never falls back to smooth-all or an angle threshold.
- Regions are greedy-coloured, faceted faces included, so a hard-edged cube gets non-zero groups and is not later detected as missing smoothing. Only if that needs more than 32 bits, isolated faceted faces (a single face whose corner normals no other face shares) get group 0 and use no bit, so a faceted fan or cone with 33+ faces at one apex still succeeds. If every face ends up at 0 the SMOOTHING-RESTORED row carries allzero=1.
- A mesh with a damaged UV0–UV2 or layer-0 colour is skipped (reason damaged-channels), even without --normalize-render-channels.
- Contrast with --rebuild-shading:
  - It destroys all normal elements and rebuilds them from smoothing.
  - Or, when there is no smoothing, it derives smoothing by connectivity (dot ≥ 0.9999). That can merge hard edges such as a cylinder seam, and more than 32 islands wrap.
  - Tangents are left stale.
  - Every run rewrites the file.
  - The strict modes therefore never enable it.

**--clean-col-geometry.**
- Kept: control points, polygons and their order, edges, hole/visibility elements, user data, names, hierarchy and transforms.
- Materials are disconnected, never destroyed. A material still used by a render node stays connected there. One left with no user is reported (COL-MATERIALS-ORPHANED).
- A _COL mesh shared with a render node (COL-SHARED-SKIPPED), with any deformer such as a skin (COL-DEFORMED-SKIPPED), or whose geometry is not a mesh (COL-NOT-MESH-SKIPPED) is skipped.
- Unity Physics Materials, BallisticMaterial and collider components are out of scope.

**Safety.**
- Classification uses the scene as imported. A mesh used by both a render and a _COL node is skipped by every mode (SHARED-MESH-SKIPPED).
- Render meshes with blend shapes or vertex caches are skipped (RENDER-DEFORMED-SKIPPED); skin-only meshes are processed.
- Backups:
  - The backup is mandatory, flushed to disk and verified byte for byte before staging.
  - A failed backup leaves the file untouched and exits 2.
  - --no-backup together with a strict flag is rejected (exit 1); legacy runs still accept it.
- Only FBX 7.1–7.5 and 7.7 are accepted, written back at the same version and encoding. Anything else gives UNSUPPORTED-FBX-VERSION and is skipped.
- A second run plans nothing and writes nothing, so the .bak is kept.
- -n previews without writing an FBX, backup or staging file.
- --inspect stays read-only. Only with a strict flag does it add each mesh's kind and layer slots; plain --inspect output is unchanged.
- .meta files are never touched.
- Any mesh error (STRICT-MESH-ERROR) or damaged channel (CHANNEL-DAMAGED) discards the scene before writing.
- In strict runs neither the per-file lines nor the summary suggest legacy flags.

**Rejected combinations.** Any strict flag plus any legacy repair flag exits 1 before any file is opened. Examples are --fill-missing-uv1, --strip-col-data, --rebuild-shading, --strip-tbn, --apply-materials-patch, --guess-textures and --convert-to-meters. --no-backup is rejected too. Allowed alongside: --detect-*, --classify-source, --debug-textures, --inspect, -n, -v, -r, -j, --report-file and --short-paths.

**Report rows.** Every row carries node='…' mesh='…' kind=render|col|shared.

| Row | Meaning |
|---|---|
| RENDER-CHANNELS-NORMALIZED | before/after inventories, the added and removed labels, and `uvnames` of added UVs |
| CHANNEL-DAMAGED | reason; an error, the file is not written |
| CHANNEL-AMBIGUOUS | reason; the mesh is untouched |
| SMOOTHING-RESTORED | groups (bits used, 0 when every face is faceted) and polygon count |
| SMOOTHING-UNREPRESENTABLE | reason and detail |
| COL-GEOMETRY-CLEANED | what was removed and how many materials were disconnected |
| COL-SHARED-SKIPPED, COL-DEFORMED-SKIPPED, COL-NOT-MESH-SKIPPED, SHARED-MESH-SKIPPED, RENDER-DEFORMED-SKIPPED | the mesh was skipped |
| MESH-ANOMALY | structural problems, reported only |
| STRICT-MESH-ERROR | an error; the file is not written |
| COL-MATERIALS-ORPHANED, UNSUPPORTED-FBX-VERSION | file-level rows |
| ERROR | file level: channel damaged or backup failed, file untouched |
| PATCHED | backup='…' |

An inventory such as `uv,col|uv|uv` lists layers in order. `!` marks damage, `*` a UV in another slot and `~order` an order mismatch.

```powershell
.\patch_fbx.exe -n -r -v --report-file strict.txt --normalize-render-channels --restore-missing-smoothing --clean-col-geometry "D:\Models"
.\patch_fbx.exe -r --normalize-render-channels "D:\Models"
.\patch_fbx.exe -r --restore-missing-smoothing "D:\Models"
.\patch_fbx.exe -r --clean-col-geometry --report-file col.md "D:\Models"
```

**Windows release verification:** MSVC 19.44 / FBX SDK 2020.3.9: all 3 CTest suites pass; the extracted ZIP passes 262 CLI integration checks on generated fixtures. The strict round trip changes FBX object UniqueIDs (34 of 34 in the fixture); ID stability is not guaranteed. The long-path case passes; the FBX 6.x rejection fixture is handwritten.

**Not verified:** Unity import/TexCoord mapping and sub-asset fileID stability, native 3ds Max smoothing, and every supported FBX version. The generated-fixture results do not establish production-asset compatibility. Unity mesh compression may requantize UVs after adding a channel; smoothing affects Normals=Calculate, not imported authored normals.

## Internal arguments

The dispatcher also accepts three internal worker arguments: --child-mode STATS_PATH (one-file patch worker), --survey-mode STATS_PATH (read-only pool survey worker), and --load-material-pool PATH (load the dispatcher-generated pool). They are implementation protocols, not normal library-processing commands, and are not included in the builder.

## Channels, operation order and backups

UV0/UV1/UV2 are FBX indices 0/1/2, corresponding to Max map channels 1/2/3. Constant UV fill is not unwrapping. Collision suffixes _COL, _Collider and _Collision are case-insensitive and support numeric tails.

Flag order does not control repair order. The tool orders its own passes: axes before units and mesh patches; TBN stripping before baking; UV-based shading before the general rebuild. Use UV-based shading only when chart seams match intended hard edges.

A successful rewrite creates .fbx.bak; a later rewrite refreshes it. Audits, -n and no-op repairs leave it unchanged. --no-backup disables it for legacy repairs and is rejected with strict modes. An FBX SDK re-save is not byte-identical to the input.

Exit codes: 0 completed (findings alone are not failure), 1 invalid CLI/no eligible inputs, 2 at least one file failed.

Online builder: https://sasharx.github.io/fbx-patch/
