import { NextResponse } from 'next/server'
import { createCanvas, loadImage } from 'canvas'
import * as cheerio from 'cheerio'
import fetch from 'node-fetch'

export async function POST(req) {
  const { url } = await req.json()
  const html = await fetch(url).then(res => res.text())
  const $ = cheerio.load(html)

  const title = $('meta[property="og:title"]').attr('content') || $('title').text()
  const image = $('meta[property="og:image"]').attr('content')
  const section = $('meta[property="article:section"]').attr('content') || 'Umum'
  const date = $('meta[property="article:published_time"]').attr('content')?.slice(0, 10) || new Date().toISOString().slice(0, 10)

  const canvas = await drawTemplate({ title, image, section, date })
  const imageData = canvas.toDataURL()

  return NextResponse.json({
    meta: { title, image, section, date },
    image: imageData
  })
}

async function drawTemplate({ title, image, section, date }) {
  const width = 1080, height = 1350
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // 1. Gambar utama (background) - DILAKUKAN PERTAMA
  if (image) {
    try {
      const img = await loadImage(image);
      
      // Set width to 1200px and maintain aspect ratio
      const targetWidth = 1200;
      const scale = targetWidth / img.width;
      const targetHeight = img.height * scale;
      
      // Draw image at position x: -56, y: 82
      ctx.drawImage(img, -56, 82, targetWidth, targetHeight);
    } catch (err) {
      console.log('Gagal load image:', err.message);
      // Fallback: Background hitam jika gambar gagal
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, width, height);
    }
  }

  // 2. Template overlay - DILAKUKAN SETELAH GAMBAR UTAMA
  try {
    const template = await loadImage('public/template.png');
    ctx.drawImage(template, 0, 0, width, height);
  } catch (err) {
    console.log('Gagal load template:', err.message);
  }

   const formatTanggal = (dateString) => {
    const dateObj = new Date(dateString);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('id-ID', { month: 'long' }).toUpperCase();
    const year = dateObj.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // 3. Teks di atas template
  ctx.fillStyle = '#fbec09';
  ctx.font = '21px sans-serif';
  ctx.fillText(
    `${section.toUpperCase()} - ${formatTanggal(date)}`, // Format baru di sini
    106, 
    927
  );

  ctx.fillStyle = 'white';
  ctx.font = 'bold 48px sans-serif';
  wrapText(ctx, title, 106, 1000, 878, 60);

  return canvas;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  const lines = [];
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && n > 0) {
      // Simpan baris saat ini
      ctx.fillText(line, x, currentY);
      lines.push({ text: line, y: currentY });
      
      // Mulai baris baru
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }

  // Tambahkan baris terakhir
  ctx.fillText(line, x, currentY);
  lines.push({ text: line, y: currentY });

  // Atur warna untuk baris terakhir (atau 2 terakhir jika >3 baris)
  if (lines.length > 0) {
    ctx.fillStyle = '#fbec09';
    
    // Jika total baris >=3, warnai 2 baris terakhir
    const startIdx = lines.length >= 3 ? lines.length - 2 : lines.length - 1;
    
    for (let i = startIdx; i < lines.length; i++) {
      ctx.fillText(lines[i].text, x, lines[i].y);
    }
  }

  return lines.length; // Mengembalikan jumlah baris
}