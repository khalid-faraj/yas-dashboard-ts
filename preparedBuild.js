import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourcePath = path.join(__dirname, 'dist', 'index.html');
const destinationPath = path.join(__dirname, 'dist', 'dashboard.html');

fs.rename(sourcePath, destinationPath, (err) => {
  if (err) {
    console.error(`Error renaming file: ${err}`);
  } else {
    console.log(`Renamed ${sourcePath} to ${destinationPath}`);
  }
});

// Ensure the destination directory exists
const destinationDir = 'dist/assets';
if (!fs.existsSync(destinationDir)) {
  fs.mkdirSync(destinationDir, { recursive: true });
}

// Define source files to copy
const filesToCopy = [];

// Function to copy a file
function copyFile(source, destination) {
  fs.copyFileSync(source, destination);
  console.log(`Copied ${source} to ${destination}`);
}

// Copy each file to the destination directory
filesToCopy.forEach((file) => {
  const destination = path.join(destinationDir, path.basename(file));
  copyFile(file, destination);
});

// Create a zip file
const outputZipPath = path.join('dist', 'assets.zip');
const output = fs.createWriteStream(outputZipPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`Zipped ${archive.pointer()} total bytes`);
  console.log(`Zipped specified files and empty "assets" folder into ${outputZipPath}`);
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);

// Add files and directories to the zip
archive.directory(destinationDir, 'assets');
filesToCopy.forEach((file) => {
  archive.file(path.join(__dirname, file), { name: path.basename(file) });
});

archive.finalize();
