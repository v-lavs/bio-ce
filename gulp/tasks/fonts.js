import gulp from 'gulp';
import { paths } from '../config/paths.js';
import { plugins } from '../config/plugins.js';
import { plumber } from '../utils/plumber.js';
import { logger } from '../utils/logger.js';

export function fonts() {
  logger.task('fonts', 'Copying fonts...');

  return gulp
    .src(`${paths.src.fonts}/**/*.{woff,woff2}`)
    .pipe(plumber())
    .pipe(plugins.newer(paths.dist.fonts))
    .pipe(gulp.dest(paths.dist.fonts));
}