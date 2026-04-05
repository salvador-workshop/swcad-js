import * as esbuild from 'esbuild'

await esbuild.buildSync({
  entryPoints: ['src/index.js'],
  bundle: true,
  outfile: 'dist/swcad.js',
  target: 'es2020',
})

await esbuild.buildSync({
  entryPoints: ['src/index.js'],
  bundle: true,
  minify: true,
  outfile: 'dist/swcad.min.js',
  target: 'es2020',
})
