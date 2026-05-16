import gulp from 'gulp';
import { paths } from '../config/paths.js';
import { html } from './html.js';
import { styles } from './styles.js';
import { scripts } from './scripts.js';
import { images } from './images.js';
import { fonts } from './fonts.js';
import { static_files } from './static.js';
import { reload } from './server.js';
import { logger } from '../utils/logger.js';

export function watcher(done) {
  logger.task('watcher', 'Watching for changes...');

  // HTML: rebuild then reload
  gulp.watch(paths.watch.html, gulp.series(html, reload));

  // Styles: compile then stream (inject without reload)
  gulp.watch(paths.watch.scss, gulp.series(styles, reload));

  // Scripts: bundle then reload
  gulp.watch(paths.watch.js, gulp.series(scripts, reload));

  // Images: copy then reload
  gulp.watch(paths.watch.images, gulp.series(images, reload));

  // Fonts: copy then reload
  gulp.watch(paths.watch.fonts, gulp.series(fonts, reload));

  // Static: copy then reload
  gulp.watch(paths.watch.static, gulp.series(static_files, reload));

  done();
}