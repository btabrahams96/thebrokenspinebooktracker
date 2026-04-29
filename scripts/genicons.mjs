import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

// Minimal solid-color PNG generator. Produces RGBA, no compression magic.
function makePng(size, [r, g, b, a = 255]) {
  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;       // bit depth
  ihdr[9] = 6;       // color type RGBA
  ihdr[10] = 0;      // compression
  ihdr[11] = 0;      // filter
  ihdr[12] = 0;      // interlace

  // IDAT — one filter byte (0) per row + RGBA pixels
  const row = Buffer.alloc(1 + size * 4);
  for (let i = 0; i < size; i++) {
    const off = 1 + i * 4;
    row[off] = r;
    row[off + 1] = g;
    row[off + 2] = b;
    row[off + 3] = a;
  }
  const raw = Buffer.concat(Array.from({ length: size }, () => row));
  const idat = deflateSync(raw);

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const t = Buffer.from(type);
    const crcInput = Buffer.concat([t, data]);
    let crc = ~0 >>> 0;
    for (let i = 0; i < crcInput.length; i++) {
      crc ^= crcInput[i];
      for (let k = 0; k < 8; k++) {
        crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
      }
    }
    crc = (~crc) >>> 0;
    const c = Buffer.alloc(4);
    c.writeUInt32BE(crc >>> 0, 0);
    return Buffer.concat([len, t, data, c]);
  }
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

// burgundy #6B1F2E
const burgundy = [0x6B, 0x1F, 0x2E];
writeFileSync('public/icon-192.png', makePng(192, burgundy));
writeFileSync('public/icon-512.png', makePng(512, burgundy));
writeFileSync('public/icon-512-maskable.png', makePng(512, burgundy));
console.log('wrote 3 PNGs');
