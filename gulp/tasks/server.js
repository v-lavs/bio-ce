import browserSync from 'browser-sync';
import { paths } from '../config/paths.js';
import { logger } from '../utils/logger.js';

export const server = browserSync.create();

export function serve(done) {
  logger.task('server', 'Starting BrowserSync...');

  server.init({
    server: {
      baseDir: paths.dist.root,
    },
    port: 3000,
    notify: false,
    open: false,
    logPrefix: 'BrowserSync',
    logLevel: 'info',
  });

  done();
}

export function reload(done) {
  server.reload();
  done();
}