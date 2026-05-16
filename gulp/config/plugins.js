import gulpPlumber from 'gulp-plumber';
import gulpNotify from 'gulp-notify';
import gulpNewer from 'gulp-newer';
import gulpIf from 'gulp-if';

export const plugins = {
  plumber: gulpPlumber,
  notify: gulpNotify,
  newer: gulpNewer,
  if: gulpIf,
};