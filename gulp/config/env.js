export const isProd = process.argv.includes('--prod');
export const isDev = !isProd;