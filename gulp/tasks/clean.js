import { deleteAsync } from 'del';
import { paths } from '../config/paths.js';
import { logger } from '../utils/logger.js';

export function clean() {
  logger.task('clean', 'Cleaning dist directory...');
  return deleteAsync(paths.dist.root);
}