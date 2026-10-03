import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logPath = path.join(__dirname, '..', 'app.log');

export function logError(message, err) {
  const line = `[${new Date().toLocaleString('ru-RU')}] ${message}: ${err.message}\n`;
  fs.appendFileSync(logPath, line);
  console.error(line.trim());
}
