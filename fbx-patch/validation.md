# FBX Patch Tool 1.0.1 validation

Validated on Windows x64 with FBX SDK 2020.3.9 and the static MSVC runtime.
The old published 1.0.0 EXE fails with the staged-export identity error on
both an SDK fixture and a copied production FBX. The 1.0.1 EXE succeeds.

## Automated regression suites

- 720 pure helper checks.
- 48 SDK/CLI checks: binary and ASCII exports and re-imports, Unicode paths,
  audit/inspect/dry-run immutability, exact backups, UV/color/material fixes,
  collision/TBN stripping, meter conversion, parallel workers and repeat runs.
  A shared-texture/conflicting-UV fixture verifies the report and repeat behavior.
- 48 staged-file I/O checks: seek/read/write/flush, owned handle lifetime,
  blocked staging deletion/foreign writes, mismatched source/target identities,
  locked/empty-file refusal, truncation and handle leak regression.
- Cppcheck 2.22.0: no warning, performance, portability or error diagnostics
  for production FBX tool translation units. Licensed SDK internals are opaque
  to this analysis; it is not a runtime memory-sanitizer result.

## Production FBX corpus

329 existing architecture FBX files, approximately 86 MiB, were copied from
the owner's working project. Project originals were verified by SHA-256
before and after testing; all 329 remain unchanged. No model files are shipped
in the release or uploaded as test data.

| Batch | Flags | Files rewritten | Files verified |
|---|---|---:|---:|
| Cleanup | `--strip-tbn --strip-col-data` | 83 | 329 |
| Metadata | `--apply-materials-patch --fix-mat-layers --fix-normal-w` | 157 | 329 |

Each batch used recursive four-worker processing. Dry runs preserved every
input and created no backup. Every rewritten file received a byte-exact
backup. All outputs were imported again through the SDK and compared against
their originals for hierarchy, names, transforms, vertex positions, polygon
indices/winding, authored normal data, render UVs/colors and material
connections. Cleanup strips the selected TBN/collision payload; metadata
checks normal W, shading and eligible texture UV bindings. The SDK omits an
empty normal placeholder in one input; no authored normal values are lost.

Second runs preserve both the repaired file hashes and the original backup
hashes. No staged FBX or `.bak.tmp` files remain after successful processing.

Four files contain shared diffuse textures with incompatible UV0 names.
They are reported as `UVSET-CONFLICT`, and those ambiguous UVSet properties
are left unchanged. Use consistent source UV channel names or separate
bindings to resolve that conflict.

These results cover the named repair sets and the SDK regression fixture,
not every possible FBX feature or flag combination. FBX SDK serialization
is not byte-identical to the input; retain backups for production use.
