import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateFavicons() {
  const svgPath = path.join(__dirname, 'public', 'favicon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  // Generate different sizes
  const sizes = [16, 32, 48, 64, 128, 256];
  
  console.log('Generating favicon files...');

  // Generate PNG versions
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(__dirname, 'public', `favicon-${size}x${size}.png`));
    console.log(`Generated favicon-${size}x${size}.png`);
  }

  // Generate Apple touch icon (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(__dirname, 'public', 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // Generate ICO file for src/app/favicon.ico
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(__dirname, 'temp-favicon.png'));

  // Convert PNG to ICO using sharp
  await sharp(path.join(__dirname, 'temp-favicon.png'))
    .resize(32, 32)
    .png()
    .toFile(path.join(__dirname, 'src', 'app', 'favicon.ico'));

  // Clean up temp file
  fs.unlinkSync(path.join(__dirname, 'temp-favicon.png'));
  console.log('Generated src/app/favicon.ico');

  console.log('All favicon files generated successfully!');
}

generateFavicons().catch(console.error); 