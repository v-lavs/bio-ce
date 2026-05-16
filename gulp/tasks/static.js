import gulp from 'gulp';
import { paths } from '../config/paths.js';
import { plugins } from '../config/plugins.js';
import { plumber } from '../utils/plumber.js';
import { logger } from '../utils/logger.js';

export function static_files() {
  logger.task('static', 'Copying static files...');

  return gulp
    .src(`${paths.src.static}/**/*`, { encoding: false })
    .pipe(plumber())
    .pipe(plugins.newer(paths.dist.root))
    .pipe(gulp.dest(paths.dist.root));
}