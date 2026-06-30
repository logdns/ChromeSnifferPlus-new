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

## Store Assets

Release-ready store assets are attached to the latest GitHub Release:

https://github.com/logdns/ChromeSnifferPlus-new/releases

- `icon-128.png`
- `promo-small-440x280.png`
- `promo-large-920x680.png`
- `marquee-1400x560.png`
- `screenshot-overview-1280x800.png`
- `listing.md`

These binary assets are intentionally not tracked in the source tree.

## Build Store Packages

From the repository root:

```bash
rm -rf dist
mkdir -p dist/chrome dist/edge dist/firefox
rsync -a --exclude='.git' --exclude='.*' --exclude='dist' --exclude='scripts' --exclude='store-assets' --exclude='screenshot' ./ dist/chrome/
rsync -a --exclude='.git' --exclude='.*' --exclude='dist' --exclude='scripts' --exclude='store-assets' --exclude='screenshot' ./ dist/edge/
rsync -a --exclude='.git' --exclude='.*' --exclude='dist' --exclude='scripts' --exclude='store-assets' --exclude='screenshot' ./ dist/firefox/
sed '1{/^importScripts/d;}' js/background.js > dist/firefox/js/background.js
jq '.background = {"scripts":["js/apps.js","js/analytics.js","js/background.js"]} | .browser_specific_settings = {"gecko":{"id":"chromesnifferplus-new@logdns.github.io","strict_min_version":"109.0","data_collection_permissions":{"required":["browsingActivity"],"optional":[]}}}' manifest.json > dist/firefox/manifest.tmp
mv dist/firefox/manifest.tmp dist/firefox/manifest.json
(cd dist/chrome && zip -qr ../chromesnifferplus-new-chrome-mv3.zip .)
(cd dist/edge && zip -qr ../chromesnifferplus-new-edge-mv3.zip .)
(cd dist/firefox && zip -qr ../chromesnifferplus-new-firefox-mv3.zip .)
```

Upload:

- `dist/chromesnifferplus-new-chrome-mv3.zip` to Chrome Web Store.
- `dist/chromesnifferplus-new-edge-mv3.zip` to Microsoft Edge Add-ons.
- `dist/chromesnifferplus-new-firefox-mv3.zip` to Firefox Add-ons.

Firefox uses a generated manifest with `background.scripts` and `browser_specific_settings.gecko`. Chrome and Edge use the source Manifest V3 `background.service_worker` manifest.

## Privacy

Local detection runs in the browser. Optional remote API lookup is only triggered manually and sends the current page hostname to the selected provider. API keys are stored in Chrome extension storage on your device. See [Privacy.md](./Privacy.md).

## Credits

- [logdns](https://github.com/logdns) for the Manifest V3 migration, UI refresh, free API lookup integration, release assets, and packaging updates.
- [justjavac](https://github.com/justjavac) for the original ChromeSnifferPlus project.
- Thanks to all upstream contributors, technology definition authors, translators, testers, and users.

## License

ChromeSnifferPlus New is released under the GPL License. See [LICENSE](./LICENSE).
