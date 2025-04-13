const esbuild = require('esbuild');
const { tailwindPlugin } = require('esbuild-plugin-tailwindcss');

(async () => {
  let ctx = await esbuild.context({
    entryPoints: ['frontend/*'],
    minify: false,
    format: 'esm',
    outdir: 'public',
    bundle: true,
    plugins: [tailwindPlugin({})],
  });
  await ctx.watch();
  console.log('Watching...');
})();
