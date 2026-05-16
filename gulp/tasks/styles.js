import gulp from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import sortMediaQueries from 'postcss-sort-media-queries';
import cssnano from 'cssnano';
import { paths } from '../config/paths.js';
import { isProd, isDev } from '../config/env.js';
import { plumber } from '../utils/plumber.js';
import { logger } from '../utils/logger.js';

const sass = gulpSass(dartSass);

export function styles() {
  logger.task('styles', isProd ? 'Compiling & minifying...' : 'Compiling...');

  const postcssPlugins = [
    autoprefixer(),
    sortMediaQueries({ sort: 'desktop-first' }),
  ];

  if (isProd) {
    postcssPlugins.push(cssnano({ preset: 'default' }));
  }

  return gulp
    .src(`${paths.src.scss}/main.scss`, { sourcemaps: isDev })
    .pipe(plumber())
    .pipe(
      sass({
        outputStyle: 'expanded',
        includePaths: ['node_modules'],
      })
    )
    .pipe(postcss(postcssPlugins))
    .pipe(gulp.dest(paths.dist.css, { sourcemaps: isDev ? '.' : false }));
}