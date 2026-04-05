import * as esbuild from 'esbuild'

await esbuild.buildSync({
  entryPoints: ['src/index.js'],
  bundle: true,
  outfile: 'dist/swcad.js',
  target: 'node24',
})

await esbuild.buildSync({
  entryPoints: ['src/index.js'],
  bundle: true,
  minify: true,
  outfile: 'dist/swcad.min.js',
  target: 'node24',
})
