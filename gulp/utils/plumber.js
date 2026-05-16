import { plugins } from '../config/plugins.js';

export function plumber() {
  return plugins.plumber({
    errorHandler: function (err) {
      const plugin = err.plugin ? `[${err.plugin}]` : '[Error]';

      console.error('');
      console.error('\x1b[31m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m');
      console.error(`\x1b[31m${plugin}\x1b[0m ${err.message}`);

      if (err.fileName) {
        console.error(`\x1b[90mFile:\x1b[0m ${err.fileName}`);
      }
      if (err.lineNumber) {
        console.error(`\x1b[90mLine:\x1b[0m ${err.lineNumber}`);
      }
      if (err.stack) {
        console.error(`\x1b[90m${err.stack}\x1b[0m`);
      }

      console.error('\x1b[31m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m');
      console.error('');

      plugins.notify.onError({
        title: `Error: ${err.plugin || 'Build'}`,
        message: '<%= error.message %>',
      })(err);

      this.emit('end');
    },
  });
}