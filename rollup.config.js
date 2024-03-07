import fg from "fast-glob";
import typescript from "rollup-plugin-ts";
import terser from "@rollup/plugin-terser";

export default [
  {
    input: fg.globSync(["!src/**/*.spec.ts", "src/**/*.ts"], {
      onlyFiles: true,
    }),
    output: [
      {
        dir: "dist/cjs/",
        format: "cjs",
        exports: "named",
        name: "MusicTempo",
      },
      {
        dir: "dist/esm/",
        format: "esm",
        exports: "named",
        name: "MusicTempo",
      },
    ],
    plugins: [typescript()],
  },
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/browser/music-bpm.min.js",
        format: "iife",
        exports: "named",
        name: "MusicTempo",
        plugins: [terser()],
      },
      {
        file: "dist/node/music-bpm.js",
        format: "iife",
        exports: "named",
        name: "MusicTempo",
      },
    ],
    plugins: [typescript()],
  },
];
