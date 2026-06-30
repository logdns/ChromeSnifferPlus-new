ChromeSnifferPlus
=================

[![](https://img.shields.io/github/issues/logdns/ChromeSnifferPlus-new.svg)](https://github.com/logdns/ChromeSnifferPlus-new/issues) [![](https://img.shields.io/github/release/logdns/ChromeSnifferPlus-new.svg)](https://github.com/logdns/ChromeSnifferPlus-new/releases)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/fhhdlnnepfjhlhilgmeepgkhjmhhhjkh.svg)](https://chrome.google.com/webstore/detail/chrome-sniffer-plus/fhhdlnnepfjhlhilgmeepgkhjmhhhjkh)

### Introduction

This extension is an extended version of the Appspector(ChromeSniffer).

Sniff web framework and javascript libraries run on browsing website. The extension also supports optional remote technology lookup APIs for category-based results like the screenshots in browser technology detectors.

With this extension, You can sniff:

- javascript Library: jQuery, ExtJS, Angular ...
- Web APIs: Blogger, Google Analytics ...
- Web Framework: WordPress, phpBB, Drupal, MediaWiki, codeigniter ...
- Web Server: PHP, Apache, nginx, IIS ...
- Remote technology categories: JavaScript framework, CDN, security, payment processor, font script, JavaScript library, web framework, UI framework, programming language ...

When you surf the internet with ChromeSnifferPlus, You can also find more unknown frameworks and libraries.

If you are a developer, you can [Create Issues](https://github.com/logdns/ChromeSnifferPlus-new/issues).

view [change log](./changelog.md)

### Remote Technology Lookup APIs

The popup can query free technology detection APIs:

- TechnologyChecker Free plan: `GET https://api.technologychecker.io/v1/domain/DOMAIN` with `Authorization: Bearer API_KEY` ([docs](https://technologychecker.io/docs/api-reference/introduction))
- BuiltWith Free API: `GET https://api.builtwith.com/free1/api.json?KEY=API_KEY&LOOKUP=DOMAIN` ([docs](https://api.builtwith.com/free-api))

Open the extension options page, choose a free provider, save its API key, then click **API lookup** in the popup. API keys are stored in Chrome extension storage on your device. The current page hostname is sent to the selected provider only when you click the lookup button. TechnologyChecker is the default because its free plan returns concrete technologies and categories; BuiltWith Free API returns technology group/category counts and update dates. Returned categories are normalized for JavaScript frameworks, CDN, security, payment processors, font scripts, JavaScript libraries, web frameworks, UI frameworks, and programming languages.

### 远程技术检测 API

弹窗可以调用免费的技术检测 API：

- TechnologyChecker 免费套餐：`GET https://api.technologychecker.io/v1/domain/DOMAIN`，请求头使用 `Authorization: Bearer API_KEY`（[文档](https://technologychecker.io/docs/api-reference/introduction)）
- BuiltWith Free API：`GET https://api.builtwith.com/free1/api.json?KEY=API_KEY&LOOKUP=DOMAIN`（[文档](https://api.builtwith.com/free-api)）

打开扩展选项页，选择免费服务商并保存 API Key，然后在弹窗点击 **API 查询**。API Key 会保存在本机 Chrome 扩展存储中；只有点击查询按钮时，当前页面域名才会发送给所选服务商。TechnologyChecker 是默认服务商，因为它的免费套餐会返回具体技术和分类；BuiltWith Free API 返回技术 group/category 数量和更新时间。返回分类会归一化为 JavaScript 框架、内容分发网络（CDN）、安全、支付处理器、字体脚本、JavaScript 库、Web 框架、用户界面（UI）框架和编程语言等分类。

### Install

- [Chrome Web Store](https://chrome.google.com/webstore/detail/chrome-sniffer-plus/fhhdlnnepfjhlhilgmeepgkhjmhhhjkh)
- [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/idjbhfcodofelbdbhaekgcecaphcgohh)

### Chrome Web Store Assets

Generated release assets are stored in `store-assets/`:

- `promo-small-440x280.png`
- `promo-large-920x680.png`
- `marquee-1400x560.png`
- `screenshot-overview-1280x800.png`
- `icon-128.png`

The publishable extension ZIP is generated under `dist/`.

### Screenshot

![ChromeSnifferPlus Screenshot](./screenshot/shot1.png) &nbsp;&nbsp;&nbsp;&nbsp;
![ChromeSnifferPlus Screenshot](./screenshot/shot2.png) &nbsp;&nbsp;&nbsp;&nbsp;
![ChromeSnifferPlus Screenshot](./screenshot/shot3.png) &nbsp;&nbsp;&nbsp;&nbsp;
![ChromeSnifferPlus Screenshot](./screenshot/shot4.png)

### Credits

- [logdns](https://github.com/logdns) for the Manifest V3 migration, UI refresh, free API lookup integration, and release assets.
- [justjavac](https://github.com/justjavac)
- Original upstream project: [justjavac/ChromeSnifferPlus](https://github.com/justjavac/ChromeSnifferPlus)
- Thanks to all contributors, maintainers, technology definition authors, translators, testers, and users who helped ChromeSnifferPlus evolve.

### License

ChromeSnifferPlus is released under the GPL License. See the bundled [LICENSE](./LICENSE) file for details.
