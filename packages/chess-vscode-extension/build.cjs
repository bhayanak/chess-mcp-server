const esbuild = require('esbuild');
const path = require('path');

async function build() {
  // Bundle the VS Code extension
  await esbuild.build({
    entryPoints: ['src/extension.ts'],
    bundle: true,
    outfile: 'dist/extension.js',
    external: ['vscode'],
    format: 'cjs',
    platform: 'node',
    target: 'node18',
    sourcemap: true,
    minify: false,
  });

  // Bundle the MCP server (from chess-server package)
  await esbuild.build({
    entryPoints: [path.join(__dirname, '..', 'chess-server', 'src', 'index.ts')],
    bundle: true,
    outfile: 'dist/server.js',
    format: 'cjs',
    platform: 'node',
    target: 'node18',
    sourcemap: true,
  });
}

build().catch(() => process.exit(1));
