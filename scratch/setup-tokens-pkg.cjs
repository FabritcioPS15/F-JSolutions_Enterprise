const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'packages', 'design-tokens');
const srcDir = path.join(baseDir, 'src');
const coreDir = path.join(srcDir, 'core');
const themesDir = path.join(srcDir, 'themes');
const cssDir = path.join(srcDir, 'css');
const tailwindDir = path.join(srcDir, 'tailwind');

[baseDir, srcDir, coreDir, themesDir, cssDir, tailwindDir].forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// 1. package.json
const pkg = {
  name: "@sparktree/design-tokens",
  version: "1.0.0",
  description: "Design tokens y temas oficiales del ecosistema SparkTree",
  main: "dist/index.js",
  types: "dist/index.d.ts",
  typesVersions: {
    "*": {
      "core": ["./dist/core/index.d.ts"],
      "themes": ["./dist/themes/index.d.ts"],
      "tailwind": ["./dist/tailwind/preset.d.ts"],
      "css": ["./dist/css/generator.d.ts"]
    }
  },
  exports: {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./core": {
      "types": "./dist/core/index.d.ts",
      "default": "./dist/core/index.js"
    },
    "./themes": {
      "types": "./dist/themes/index.d.ts",
      "default": "./dist/themes/index.js"
    },
    "./tailwind": {
      "types": "./dist/tailwind/preset.d.ts",
      "default": "./dist/tailwind/preset.js"
    },
    "./css": {
      "types": "./dist/css/generator.d.ts",
      "default": "./dist/css/generator.js"
    }
  },
  files: ["dist"],
  scripts: {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  devDependencies: {
    "@types/node": "^24.10.4",
    "typescript": "^5.4.5"
  }
};
fs.writeFileSync(path.join(baseDir, 'package.json'), JSON.stringify(pkg, null, 2), 'utf8');

// 2. tsconfig.json
const tsconfig = {
  compilerOptions: {
    target: "ES2022",
    module: "commonjs",
    lib: ["ES2022", "DOM"],
    declaration: true,
    declarationMap: true,
    sourceMap: true,
    outDir: "./dist",
    rootDir: "./src",
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true
  },
  include: ["src/**/*"]
};
fs.writeFileSync(path.join(baseDir, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2), 'utf8');

console.log('package.json & tsconfig.json created for design-tokens');
