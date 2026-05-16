import { build } from 'esbuild';
import { paths } from '../config/paths.js';
import { isProd, isDev } from '../config/env.js';
import { logger } from '../utils/logger.js';

export async function scripts() {
  logger.task('scripts', isProd ? 'Bundling & minifying...' : 'Bundling...');

  try {
    await build({
      entryPoints: [`${paths.src.js}/app.js`],
      bundle: true,
      outdir: paths.dist.js,
      sourcemap: isDev,
      minify: isProd,
      target: 'es2020',
      format: 'iife',
      logLevel: 'warning',
    });
  } catch (err) {
    console.error('');
    console.error('\x1b[31m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m');
    console.error(`\x1b[31m[esbuild]\x1b[0m Build failed`);
    console.error(err.message);
    console.error('\x1b[31m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m');
    console.error('');
  }
}