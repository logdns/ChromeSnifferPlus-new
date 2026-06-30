var currentTab = null;

function t(key) {
    return chrome.i18n.getMessage(key) || key;
}

function setText(id, value) {
    var el = document.getElementById(id);
    if (el) {
        el.textContent = value;
    }
}

function createTechnologyLink(item) {
    var link = document.createElement('a');
    var name = document.createElement('span');
    name.textContent = item.name;

    link.href = item.url || appinfo[''].url.replace('%s', item.name);
    link.target = '_blank';
    link.appendChild(name);

    if (item.version) {
        var version = document.createElement('span');
        version.className = 'remote-badge';
        version.textContent = item.version;
        link.appendChild(version);
    }

    if (item.confidence) {
        var confidence = document.createElement('span');
        confidence.className = 'remote-badge';
        confidence.textContent = t('remoteDetectorConfidence') + ' ' + item.confidence + '%';
        link.appendChild(confidence);
    }

    if (item.summary) {
        var summary = document.createElement('span');
        summary.className = 'remote-badge';
        summary.textContent = item.summary;
        link.appendChild(summary);
    }

    return link;
}

function getCategoryLabel(category) {
    if (chrome.i18n.getUILanguage().indexOf('zh') !== 0) {
        return category;
    }

    var labels = {
        'analytics': '分析',
        'blog': '博客',
        'cms': '内容管理系统（CMS）',
        'content delivery network': '内容分发网络（CDN）',
        'cdn': '内容分发网络（CDN）',
        'content management system': '内容管理系统（CMS）',
        'database': '数据库',
        'font script': '字体脚本',
        'font scripts': '字体脚本',
        'javascript framework': 'JavaScript 框架',
        'javascript frameworks': 'JavaScript 框架',
        'javascript library': 'JavaScript 库',
        'javascript libraries': 'JavaScript 库',
        'miscellaneous': '杂项',
        'payment processor': '支付处理器',
        'payment processors': '支付处理器',
        'programming language': '编程语言',
        'programming languages': '编程语言',
        'reverse proxy': '反向代理',
        'security': '安全',
        'ui framework': '用户界面（UI）框架',
        'ui frameworks': '用户界面（UI）框架',
        'web framework': 'Web 框架',
        'web frameworks': 'Web 框架',
        'web server': 'Web 服务器',
        'web servers': 'Web 服务器',
        'video player': '视频播放器'
    };

    return labels[category.toLowerCase()] || category;
}

var preferredCategoryOrder = [
    'JavaScript Framework',
    'Content Delivery Network',
    'Security',
    'Payment Processor',
    'Font Script',
    'JavaScript Library',
    'Web Framework',
    'UI Framework',
    'Programming Language'
];

function sortCategories(categories) {
    return categories.sort(function(a, b) {
        var aIndex = preferredCategoryOrder.indexOf(a);
        var bIndex = preferredCategoryOrder.indexOf(b);

        if (aIndex !== -1 || bIndex !== -1) {
            if (aIndex === -1) {
                return 1;
            }
            if (bIndex === -1) {
                return -1;
            }

            return aIndex - bIndex;
        }

        return a.localeCompare(b);
    });
}

function renderRemoteResults(result) {
    var display = document.getElementById('remote_results');
    var groups = result.groups || {};
    var categories = sortCategories(Object.keys(groups));

    display.textContent = '';

    if (categories.length === 0) {
        setText('remote_status', t('remoteDetectorEmpty'));
        return;
    }

    setText('remote_status', result.provider + ' · ' + categories.length + ' ' + t('remoteDetectorCategories'));

    for (var i = 0; i < categories.length; i++) {
        var category = categories[i];
        var section = document.createElement('section');
        var title = document.createElement('h3');
        title.textContent = getCategoryLabel(category);
        section.className = 'remote-category';
        section.appendChild(title);

        for (var j = 0; j < groups[category].length; j++) {
            section.appendChild(createTechnologyLink(groups[category][j]));
        }

        display.appendChild(section);
    }
}

function runRemoteDetection() {
    if (!currentTab || !currentTab.url) {
        return;
    }

    setText('remote_status', t('remoteDetectorLoading'));
    document.getElementById('remote_results').textContent = '';

    chrome.runtime.sendMessage({
        msg: 'remoteDetect',
        url: currentTab.url
    }, function(response) {
        if (!response || !response.ok) {
            setText('remote_status', response && response.error ? response.error : t('remoteDetectorFailed'));
            return;
        }

        renderRemoteResults(response.result);
    });
}

setText('local_title', t('localDetectorTitle'));
setText('remote_detect', t('remoteDetectorButton'));
setText('remote_options', t('remoteDetectorOptions'));
setText('remote_status', t('remoteDetectorReady'));

document.getElementById('remote_detect').addEventListener('click', runRemoteDetection);

chrome.tabs.query({
    active: true,
    currentWindow: true
},
function(tabs) {
    currentTab = tabs[0];

    if (!currentTab) {
        return;
    }

    chrome.runtime.sendMessage({
        msg: "get",
        tab: currentTab.id
    },
    function(response) {
        var display = document.getElementById('app_list');

        var apps = response && response.apps ? response.apps: {};

        for (var appid in apps) {
            var app = appinfo[appid] ? appinfo[appid] : {};

            if (!app.title) app.title = appid;
            if (!app.url) app.url = appinfo[''].url.replace('%s', appid); // it's google one
            // if (!app.icon) app.icon = appinfo[''].icon;

            if (apps[appid] != "-1") {
                app.title = appid + ' <span class="lib_version">' + apps[appid] + '</span>';
            }

            var link = document.createElement('a');
            link.target = "_blank";
            // link.title = app.title;
            link.href = app.url;

            if (app.icon !== undefined) {
                var icon = document.createElement('img');
                icon.width = 16;
                icon.height = 16;
                icon.src = "apps/" + app.icon;
            } else {
                var icon = document.createElement('span');
                icon.className = "icon";
            }

            var text = document.createElement('span');
            text.innerHTML = app.title;

            link.appendChild(icon);
            link.appendChild(text);
            display.appendChild(link);
        }
    });
});
