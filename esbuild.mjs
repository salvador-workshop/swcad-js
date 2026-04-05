import * as esbuild from 'esbuild'

// Build the main library

await esbuild.buildSync({
  entryPoints: ['src/index.js'],
  bundle: true,
  outfile: 'dist/swcad.js',
  target: 'es2020',
  format: 'cjs',
})

await esbuild.buildSync({
  entryPoints: ['src/index.js'],
  bundle: true,
  minify: true,
  outfile: 'dist/swcad.min.js',
  target: 'es2020',
  format: 'cjs',
})


// Build the debug versions

await esbuild.buildSync({
  entryPoints: ['src/debug.js'],
  bundle: true,
  outfile: 'dist/swcad.debug.js',
  target: 'es2020',
  format: 'cjs',
})

await esbuild.buildSync({
  entryPoints: ['src/debug.js'],
  bundle: true,
  minify: true,
  outfile: 'dist/swcad.debug.min.js',
  target: 'es2020',
  format: 'cjs',
})
