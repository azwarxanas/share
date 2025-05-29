import { NextResponse } from 'next/server'
import { createCanvas, loadImage } from 'canvas'

export async function POST(req) {
  try {
    const { title, image, section, date } = await req.json()
    
    const canvas = await drawTemplate({ title, image, section, date })
    const imageData = canvas.toDataURL()

    return NextResponse.json({
      image: imageData
    })
    
  } catch (error) {
    console.error('Error in update route:', error)
    return NextResponse.json(
      { error: 'Failed to update image' },
      { status: 500 }
    )
  }
}

// Fungsi yang sama seperti di generator route
async function drawTemplate({ title, image, section, date }) {
  const width = 1080, height = 1350
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // 1. Gambar utama (background)
  if (image) {
    try {
      const img = await loadImage(image);
      const targetWidth = 1200;
      const scale = targetWidth / img.width;
      const targetHeight = img.height * scale;
      ctx.drawImage(img, -56, 82, targetWidth, targetHeight);
    } catch (err) {
      console.log('Gagal load image:', err.message);
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, width, height);
    }
  }

  // 2. Template overlay
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
    `${section.toUpperCase()} - ${formatTanggal(date)}`,
    106, 
    927
  );

  ctx.fillStyle = 'white';
  ctx.font = 'bold 48px sans-serif';
  wrapText(ctx, title, 106, 1000, 878, 60);

  return canvas;
}

// Fungsi yang sama seperti di generator route
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
      ctx.fillText(line, x, currentY);
      lines.push({ text: line, y: currentY });
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }

  ctx.fillText(line, x, currentY);
  lines.push({ text: line, y: currentY });

  if (lines.length > 0) {
    ctx.fillStyle = '#fbec09';
    const startIdx = lines.length >= 3 ? lines.length - 2 : lines.length - 1;
    for (let i = startIdx; i < lines.length; i++) {
      ctx.fillText(lines[i].text, x, lines[i].y);
    }
  }

  return lines.length;
}