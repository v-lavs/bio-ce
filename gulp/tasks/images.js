import gulp from 'gulp';
import sharp from 'sharp';
import { Transform } from 'node:stream';
import path from 'node:path';
import { paths } from '../config/paths.js';
import { isProd } from '../config/env.js';
import { plugins } from '../config/plugins.js';
import { plumber } from '../utils/plumber.js';
import { logger } from '../utils/logger.js';

function sharpOptimize() {
  return new Transform({
    objectMode: true,
    async transform(file, encoding, callback) {
      if (file.isNull()) {
        callback(null, file);
        return;
      }

      const ext = path.extname(file.path).toLowerCase();

      try {
        let optimized;

        switch (ext) {
          case '.png':
            optimized = await sharp(file.contents).png({ quality: 80 }).toBuffer();
            break;
          case '.jpg':
          case '.jpeg':
            optimized = await sharp(file.contents).jpeg({ quality: 80 }).toBuffer();
            break;
          case '.gif':
            optimized = await sharp(file.contents).gif().toBuffer();
            break;
          case '.webp':
            optimized = await sharp(file.contents).webp({ quality: 80 }).toBuffer();
            break;
          case '.svg':
            // SVGs pass through - optimize separately with svgo if needed
            callback(null, file);
            return;
          default:
            callback(null, file);
            return;
        }

        file.contents = optimized;
        callback(null, file);
      } catch (err) {
        console.error(`\x1b[31m[images]\x1b[0m Error processing ${file.relative}: ${err.message}`);
        callback(null, file);
      }
    },
  });
}

function generateWebp() {
  return new Transform({
    objectMode: true,
    async transform(file, encoding, callback) {
      if (file.isNull()) {
        callback(null, file);
        return;
      }

      const ext = path.extname(file.path).toLowerCase();

      if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
        callback(null, file);
        return;
      }

      try {
        const webpBuffer = await sharp(file.contents).webp({ quality: 80 }).toBuffer();
        const webpFile = file.clone();
        webpFile.contents = webpBuffer;
        webpFile.extname = '.webp';

        // Push original and webp
        this.push(file);
        callback(null, webpFile);
      } catch (err) {
        console.error(`\x1b[31m[images]\x1b[0m WebP error for ${file.relative}: ${err.message}`);
        callback(null, file);
      }
    },
  });
}

export function images() {
  logger.task('images', isProd ? 'Optimizing & generating WebP...' : 'Copying...');

  return gulp
    .src(`${paths.src.images}/**/*.{jpg,jpeg,png,gif,svg,webp}`, { encoding: false })
    .pipe(plumber())
    .pipe(plugins.newer(paths.dist.images))
    .pipe(plugins.if(isProd, sharpOptimize()))
    .pipe(plugins.if(isProd, generateWebp()))
    .pipe(gulp.dest(paths.dist.images));
}