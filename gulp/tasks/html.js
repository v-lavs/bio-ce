import gulp from 'gulp';
import nunjucksRender from 'gulp-nunjucks-render';
import { paths } from '../config/paths.js';
import { plumber } from '../utils/plumber.js';
import { logger } from '../utils/logger.js';

const templateData = {
  siteName: 'My Site',
  year: new Date().getFullYear(),
};

export function html() {
  logger.task('html', 'Building...');

  return gulp
    .src(`${paths.src.html}/*.{html,njk}`)
    .pipe(plumber())
    .pipe(
      nunjucksRender({
        path: [paths.src.html],
        data: templateData,
        envOptions: {
          trimBlocks: true,
          lstripBlocks: true,
        },
      })
    )
    .pipe(gulp.dest(paths.dist.html));
}
