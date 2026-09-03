{
  "targets": [
    {
      "target_name": "tree_sitter_abl_binding",
      "dependencies": [
        "<!(node -p \"require('node-addon-api').targets\"):node_addon_api_except",
      ],
      "include_dirs": [
        "src",
      ],
      "sources": [
        "bindings/node/binding.cc",
        "src/parser.c",
      ],
      "variables": {
        "has_scanner": "<!(node -p \"fs.existsSync('src/scanner.c')\")"
      },
      "conditions": [
        ["has_scanner=='true'", {
          "sources+": ["src/scanner.c"],
        }],
        ["OS!='win'", {
          "cflags_c": [
            "-std=c11",
          ],
        }, { # OS == "win" — MSVC cl.exe hits C1060 (out of compiler heap) on the
             # generated src/parser.c once it grows past ~100 MB (measured on
             # feat/appbuilder-round4, 147 MB / 38 897 states). ClangCL handles the
             # same translation unit without the internal heap limit; it accepts the
             # same /std:c11 /utf-8 flags below since it is MSVC-compatible.
          "msbuild_toolset": "ClangCL",
          "cflags_c": [
            "/std:c11",
            "/utf-8",
          ],
        }],
      ],
    }
  ]
}
