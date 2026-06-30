# ChromeSnifferPlus New

[![GitHub release](https://img.shields.io/github/v/release/logdns/ChromeSnifferPlus-new)](https://github.com/logdns/ChromeSnifferPlus-new/releases)
[![License: GPL](https://img.shields.io/badge/license-GPL-blue.svg)](./LICENSE)

ChromeSnifferPlus New is a Manifest V3 website technology detector for Chrome-compatible browsers. It is forked from [justjavac/ChromeSnifferPlus](https://github.com/justjavac/ChromeSnifferPlus) and updated for the current Chrome extension platform.

## Features

- Manifest V3 service worker architecture.
- Local detection for common CMS, JavaScript libraries, web frameworks, analytics tools, APIs, and web servers.
- Normalized remote technology categories for JavaScript frameworks, CDN, security, payment processors, font scripts, JavaScript libraries, web frameworks, UI frameworks, and programming languages.
- Optional free API lookup providers:
  - TechnologyChecker Free plan: `GET https://api.technologychecker.io/v1/domain/DOMAIN`
  - BuiltWith Free API: `GET https://api.builtwith.com/free1/api.json?KEY=API_KEY&LOOKUP=DOMAIN`
- Refreshed options page and new release icons.

## Install

Download the latest release ZIP from:

https://github.com/logdns/ChromeSnifferPlus-new/releases

For local development:

1. Open `chrome://extensions/`.
2. Enable Developer mode.
3. Click **Load unpacked**.
4. Select this repository folder.

## Chrome Web Store Assets

Release-ready store assets are in [store-assets](./store-assets):

- `icon-128.png`
- `promo-small-440x280.png`
- `promo-large-920x680.png`
- `marquee-1400x560.png`
- `screenshot-overview-1280x800.png`
- `listing.md`

## Build A Release ZIP

From the repository root:

```bash
rm -rf dist
mkdir -p dist/chromesnifferplus-new
rsync -a --exclude='.git' --exclude='.*' --exclude='dist' --exclude='scripts' --exclude='store-assets' --exclude='screenshot' ./ dist/chromesnifferplus-new/
cd dist/chromesnifferplus-new
zip -qr ../chromesnifferplus-new-mv3.zip .
```

Upload `dist/chromesnifferplus-new-mv3.zip` to the Chrome Web Store developer dashboard.

## Privacy

Local detection runs in the browser. Optional remote API lookup is only triggered manually and sends the current page hostname to the selected provider. API keys are stored in Chrome extension storage on your device. See [Privacy.md](./Privacy.md).

## Credits

- [logdns](https://github.com/logdns) for the Manifest V3 migration, UI refresh, free API lookup integration, release assets, and packaging updates.
- [justjavac](https://github.com/justjavac) for the original ChromeSnifferPlus project.
- Thanks to all upstream contributors, technology definition authors, translators, testers, and users.

## License

ChromeSnifferPlus New is released under the GPL License. See [LICENSE](./LICENSE).
