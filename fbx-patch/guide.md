# FBX Patch Tool 1.0.0

Complete Windows x64 command reference. No Max, Unity or Qt installation is needed.

Audit and repair existing FBX libraries: materials, textures, UVs, vertex colors, collisions, normals, smoothing, units, axes, geometry and metadata. Process multiple files and folders in one run.

Download: https://github.com/SashaRX/MaxModelBatch-Releases/releases/tag/patch-fbx-v1.0.0

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

**Known issue in 1.0.0:** applying repairs can fail with `staged export is no longer the file that was validated`, exit code 2. Use audit or preview for now. Keep the `.bak.tmp` named in the error. This documentation update does not fix the EXE issue.

## All 62 user-facing options

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
| `--apply-materials-patch` | Enable texture shading, fill empty relative texture paths and bind diffuse textures to UV0. These three repairs are off by default. |
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

## Internal arguments

The dispatcher also accepts three internal worker arguments: --child-mode STATS_PATH (one-file patch worker), --survey-mode STATS_PATH (read-only pool survey worker), and --load-material-pool PATH (load the dispatcher-generated pool). They are implementation protocols, not normal library-processing commands, and are not included in the builder.

## Channels, operation order and backups

UV0/UV1/UV2 are FBX indices 0/1/2, corresponding to Max map channels 1/2/3. Constant UV fill is not unwrapping. Collision suffixes _COL, _Collider and _Collision are case-insensitive and support numeric tails.

Flag order does not control repair order. The tool orders its own passes: axes before units and mesh patches; TBN stripping before baking; UV-based shading before the general rebuild. Use UV-based shading only when chart seams match intended hard edges.

A successful rewrite creates .fbx.bak; a later rewrite refreshes it. Audits, -n and no-op repairs leave it unchanged. --no-backup disables it. An FBX SDK re-save is not byte-identical to the input.

Exit codes: 0 completed (findings alone are not failure), 1 invalid CLI/no eligible inputs, 2 at least one file failed.

Online builder: https://sasharx.github.io/fbx-patch/
