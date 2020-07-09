import archiver from 'archiver';
import extract from 'extract-zip';
import fs from 'fs';

/**
 * @param {String} source
 * @param {String} out
 * @returns {Promise}
 */
export function zip(source, out) {
  const archive = archiver('zip', {zlib: {level: 9}});
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on('error', (err) => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
}

export async function unzip(source, out) {
  try {
    await extract(source, {dir: out});
  } catch (err) {
    throw new Error('Could not extract file');
  }
}
