/**
 * Generate QR codes for the candidate form.
 *
 * Usage:
 *   node tools/generate-qr.mjs                       # uses the URL from src/candidate/config.ts
 *   node tools/generate-qr.mjs https://example.com   # override the URL
 *   CANDIDATE_URL=https://example.com npm run qr      # override via env
 *
 * Output (public/candidate-qr/):
 *   candidate-qr.svg          — vector, scales to any print size
 *   candidate-qr.png          — 1200×1200 px raster
 *   candidate-qr@2x.png       — 2400×2400 px raster (high quality)
 *
 * No logo is embedded in the center (keeps scanning reliable), and the code
 * uses maximum black/white contrast.
 */
import QRCode from 'qrcode';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'public', 'candidate-qr');

async function resolveUrl() {
  if (process.argv[2]) return process.argv[2];
  if (process.env.CANDIDATE_URL) return process.env.CANDIDATE_URL;
  // Read the production URL straight from config.ts so it stays the single source of truth.
  try {
    const cfg = await readFile(path.join(root, 'src', 'candidate', 'config.ts'), 'utf8');
    const m = cfg.match(/CANDIDATE_PRODUCTION_URL\s*=\s*'([^']+)'/);
    if (m) return m[1];
  } catch {
    /* ignore */
  }
  return 'https://www.powertech.net.pl/candidate';
}

async function main() {
  const url = await resolveUrl();

  if (/localhost|127\.0\.0\.1|:3000/.test(url)) {
    console.error(
      `Refusing to generate a QR code for a localhost URL: ${url}\n` +
        'Set the real production URL in src/candidate/config.ts (CANDIDATE_PRODUCTION_URL) ' +
        'or pass it as an argument.'
    );
    process.exit(1);
  }

  await mkdir(outDir, { recursive: true });

  const opts = {
    errorCorrectionLevel: 'M',
    margin: 4,
    color: { dark: '#000000ff', light: '#ffffffff' },
  };

  const svg = await QRCode.toString(url, { ...opts, type: 'svg' });
  await writeFile(path.join(outDir, 'candidate-qr.svg'), svg, 'utf8');

  await QRCode.toFile(path.join(outDir, 'candidate-qr.png'), url, { ...opts, width: 1200 });
  await QRCode.toFile(path.join(outDir, 'candidate-qr@2x.png'), url, { ...opts, width: 2400 });

  console.log('QR codes generated for:', url);
  console.log('  →', path.relative(root, path.join(outDir, 'candidate-qr.svg')));
  console.log('  →', path.relative(root, path.join(outDir, 'candidate-qr.png')), '(1200×1200)');
  console.log('  →', path.relative(root, path.join(outDir, 'candidate-qr@2x.png')), '(2400×2400)');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
