const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function timestamp() {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour12: false });
  return `${colors.gray}[${time}]${colors.reset}`;
}

export const logger = {
  info(msg) {
    console.log(`${timestamp()} ${colors.cyan}ℹ${colors.reset} ${msg}`);
  },

  success(msg) {
    console.log(`${timestamp()} ${colors.green}✓${colors.reset} ${msg}`);
  },

  warn(msg) {
    console.warn(`${timestamp()} ${colors.yellow}⚠${colors.reset} ${msg}`);
  },

  error(msg, err) {
    console.error(`${timestamp()} ${colors.red}✗${colors.reset} ${msg}`);
    if (err) {
      console.error(`${colors.gray}${err.stack || err.message || err}${colors.reset}`);
    }
  },

  task(taskName, msg) {
    console.log(`${timestamp()} ${colors.magenta}[${taskName}]${colors.reset} ${msg}`);
  },
};