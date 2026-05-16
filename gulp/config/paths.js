const srcPath = './src';
const distPath = './dist';

export const paths = {
  src: {
    root: srcPath,
    html: `${srcPath}/html`,
    scss: `${srcPath}/scss`,
    js: `${srcPath}/js`,
    images: `${srcPath}/images`,
    fonts: `${srcPath}/fonts`,
    static: `${srcPath}/static`,
  },
  dist: {
    root: distPath,
    html: distPath,
    css: `${distPath}/css`,
    js: `${distPath}/js`,
    images: `${distPath}/images`,
    fonts: `${distPath}/fonts`,
  },
  watch: {
    html: `${srcPath}/html/**/*.{html,njk}`,
    scss: `${srcPath}/scss/**/*.scss`,
    js: `${srcPath}/js/**/*.js`,
    images: `${srcPath}/images/**/*.{jpg,jpeg,png,gif,svg,webp}`,
    fonts: `${srcPath}/fonts/**/*.{woff,woff2}`,
    static: `${srcPath}/static/**/*`,
  },
};