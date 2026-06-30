const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const storeDir = path.join(root, 'store-assets');
fs.mkdirSync(storeDir, { recursive: true });

function write(file, content) {
  fs.writeFileSync(path.join(root, file), content);
}

function renderSvg(svgPath, size, outPath) {
  const outDir = path.dirname(outPath);
  fs.mkdirSync(outDir, { recursive: true });
  execFileSync('sips', ['-s', 'format', 'png', svgPath, '--out', outPath], {
    stdio: 'ignore'
  });
}

function convertPng(src, outPath, width, height) {
  execFileSync('sips', ['-z', String(height), String(width), src, '--out', outPath], {
    stdio: 'ignore'
  });
}

const iconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="g" x1="160" y1="120" x2="880" y2="900" gradientUnits="userSpaceOnUse">
      <stop stop-color="#1A73E8"/>
      <stop offset="0.55" stop-color="#18A058"/>
      <stop offset="1" stop-color="#111827"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="24" stdDeviation="28" flood-color="#0F172A" flood-opacity="0.22"/>
    </filter>
  </defs>
  <rect width="1024" height="1024" rx="216" fill="#F8FBFF"/>
  <rect x="116" y="116" width="792" height="792" rx="184" fill="url(#g)" filter="url(#shadow)"/>
  <g fill="none" stroke="#FFFFFF" stroke-width="46" stroke-linecap="round" stroke-linejoin="round">
    <path d="M308 374H202v276h106"/>
    <path d="M716 374h106v276H716"/>
    <path d="M456 304 372 720"/>
    <path d="M568 304 652 720"/>
  </g>
  <circle cx="512" cy="512" r="86" fill="#FFFFFF" opacity="0.14"/>
  <circle cx="512" cy="512" r="38" fill="#FFFFFF"/>
</svg>`;

const promoSvg = (width, height, title, subtitle) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${width}" y2="${height}">
      <stop stop-color="#F8FBFF"/>
      <stop offset="1" stop-color="#E8F0FE"/>
    </linearGradient>
    <linearGradient id="mark" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#1A73E8"/>
      <stop offset="0.62" stop-color="#18A058"/>
      <stop offset="1" stop-color="#111827"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" rx="${Math.round(width * 0.035)}" fill="url(#bg)"/>
  <circle cx="${width - 110}" cy="90" r="190" fill="#DFF7E8" opacity="0.72"/>
  <circle cx="${width - 260}" cy="${height - 40}" r="180" fill="#D9E8FF" opacity="0.88"/>
  <rect x="${Math.round(width * 0.08)}" y="${Math.round(height * 0.18)}" width="${Math.round(width * 0.18)}" height="${Math.round(width * 0.18)}" rx="${Math.round(width * 0.04)}" fill="url(#mark)"/>
  <g fill="none" stroke="#FFFFFF" stroke-width="${Math.max(8, Math.round(width * 0.018))}" stroke-linecap="round" stroke-linejoin="round" transform="translate(${Math.round(width * 0.116)} ${Math.round(height * 0.245)}) scale(${width / 1400})">
    <path d="M70 85H15v145h55"/>
    <path d="M260 85h55v145h-55"/>
    <path d="M145 40 105 275"/>
    <path d="M190 40 230 275"/>
  </g>
  <text x="${Math.round(width * 0.32)}" y="${Math.round(height * 0.36)}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif" font-size="${Math.round(width * 0.07)}" font-weight="800" fill="#102A43">${title}</text>
  <text x="${Math.round(width * 0.32)}" y="${Math.round(height * 0.50)}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif" font-size="${Math.round(width * 0.035)}" font-weight="600" fill="#334E68">${subtitle}</text>
  <g font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif" font-size="${Math.round(width * 0.026)}" font-weight="700">
    <rect x="${Math.round(width * 0.32)}" y="${Math.round(height * 0.62)}" width="${Math.round(width * 0.16)}" height="${Math.round(height * 0.10)}" rx="14" fill="#FFFFFF"/>
    <text x="${Math.round(width * 0.345)}" y="${Math.round(height * 0.685)}" fill="#1A73E8">Frameworks</text>
    <rect x="${Math.round(width * 0.50)}" y="${Math.round(height * 0.62)}" width="${Math.round(width * 0.12)}" height="${Math.round(height * 0.10)}" rx="14" fill="#FFFFFF"/>
    <text x="${Math.round(width * 0.535)}" y="${Math.round(height * 0.685)}" fill="#18A058">CDN</text>
    <rect x="${Math.round(width * 0.64)}" y="${Math.round(height * 0.62)}" width="${Math.round(width * 0.16)}" height="${Math.round(height * 0.10)}" rx="14" fill="#FFFFFF"/>
    <text x="${Math.round(width * 0.668)}" y="${Math.round(height * 0.685)}" fill="#111827">Security</text>
  </g>
</svg>`;

const screenshotSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800" viewBox="0 0 1280 800">
  <rect width="1280" height="800" fill="#EEF4FF"/>
  <rect x="118" y="82" width="1044" height="636" rx="24" fill="#FFFFFF" stroke="#D9E2EC"/>
  <text x="170" y="160" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif" font-size="42" font-weight="800" fill="#102A43">LibSniffer</text>
  <text x="170" y="210" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif" font-size="22" fill="#52606D">Detect website frameworks, CDN, security, payments, fonts and libraries.</text>
  <g font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif" font-size="24" fill="#243B53">
    <text x="170" y="306" font-weight="700">JavaScript Framework</text>
    <text x="170" y="360">React · Vue · Angular</text>
    <text x="170" y="440" font-weight="700">Content Delivery Network</text>
    <text x="170" y="494">Cloudflare · jsDelivr · CDNJS</text>
    <text x="710" y="306" font-weight="700">Security</text>
    <text x="710" y="360">reCaptcha · SSL · WAF</text>
    <text x="710" y="440" font-weight="700">UI Framework</text>
    <text x="710" y="494">Bootstrap · Animate.css · Tailwind</text>
  </g>
  <rect x="170" y="590" width="270" height="56" rx="10" fill="#1A73E8"/>
  <text x="210" y="627" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif" font-size="22" font-weight="700" fill="#FFFFFF">Open popup</text>
</svg>`;

write('store-assets/icon-source.svg', iconSvg);
write('store-assets/promo-small.svg', promoSvg(440, 280, 'LibSniffer', 'Website tech detector'));
write('store-assets/promo-large.svg', promoSvg(920, 680, 'LibSniffer', 'Frameworks, CDN, security'));
write('store-assets/marquee.svg', promoSvg(1400, 560, 'LibSniffer', 'Fast website technology detection'));
write('store-assets/screenshot-overview.svg', screenshotSvg);

const iconSource = path.join(storeDir, 'icon-source.svg');
renderSvg(iconSource, 1024, path.join(storeDir, 'icon-1024.png'));
for (const size of [16, 19, 32, 48, 128]) {
  convertPng(path.join(storeDir, 'icon-1024.png'), path.join(root, size === 19 ? 'icon.png' : `icon${size}.png`), size, size);
}
convertPng(path.join(storeDir, 'icon-1024.png'), path.join(storeDir, 'icon-128.png'), 128, 128);
execFileSync('sips', ['-s', 'format', 'ico', path.join(root, 'icon128.png'), '--out', path.join(root, 'icon.ico')], {
  stdio: 'ignore'
});

renderSvg(path.join(storeDir, 'promo-small.svg'), 440, path.join(storeDir, 'promo-small-440x280.png'));
renderSvg(path.join(storeDir, 'promo-large.svg'), 920, path.join(storeDir, 'promo-large-920x680.png'));
renderSvg(path.join(storeDir, 'marquee.svg'), 1400, path.join(storeDir, 'marquee-1400x560.png'));
renderSvg(path.join(storeDir, 'screenshot-overview.svg'), 1280, path.join(storeDir, 'screenshot-overview-1280x800.png'));

console.log('Generated extension icons and Chrome Web Store assets in store-assets/.');
