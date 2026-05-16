import gulp from 'gulp';
import { clean } from './gulp/tasks/clean.js';
import { html } from './gulp/tasks/html.js';
import { styles } from './gulp/tasks/styles.js';
import { scripts } from './gulp/tasks/scripts.js';
import { images } from './gulp/tasks/images.js';
import { fonts } from './gulp/tasks/fonts.js';
import { static_files } from './gulp/tasks/static.js';
import { serve } from './gulp/tasks/server.js';
import { watcher } from './gulp/tasks/watcher.js';

// Parallel asset compilation
const compile = gulp.parallel(html, styles, scripts, images, fonts, static_files);

// Development: clean → compile → serve → watch
const dev = gulp.series(clean, compile, serve, watcher);

// Production: clean → compile (with --prod flag)
const build = gulp.series(clean, compile);

// Export tasks
export { clean };
export { html };
export { styles };
export { scripts };
export { images };
export { fonts };
export { static_files };
export { build };

// Default task (development)
export default dev;