importScripts('apps.js', 'analytics.js');

/**
 * Created with JetBrains PhpStorm.
 * User: buihoangvu
 * User: justjavac <justjavac@gmail.com>
 * Date: 10/4/13
 * Time: 3:28 PM
 * To change this template use File | Settings | File Templates.
 */

globalThis.dd = function(msg) {
    console.log(msg);
};

var tabinfo = {};

function getTabInfoKey(tabId) {
    return 'tabinfo:' + tabId;
}

function getTabInfoStorage() {
    return chrome.storage.session || chrome.storage.local;
}

async function getTabInfo(tabId) {
    if (tabinfo[tabId]) {
        return tabinfo[tabId];
    }

    var key = getTabInfoKey(tabId);
    var items = await getTabInfoStorage().get(key);
    tabinfo[tabId] = items[key] || {};

    return tabinfo[tabId];
}

async function setTabInfo(tabId, info) {
    var key = getTabInfoKey(tabId);
    var item = {};

    tabinfo[tabId] = info;
    item[key] = info;

    await getTabInfoStorage().set(item);
}

async function removeTabInfo(tabId) {
    delete tabinfo[tabId];
    await getTabInfoStorage().remove(getTabInfoKey(tabId));
}

// initial list of header detection.  will move this to a separate file later.
var knownHeaders = {
    'x-powered-by': {
        // 'Ruby on Rails': /Phusion Passenger/,
        'Express.js': /Express/,
        'PHP': /PHP\/?(.*)/,
        'ASP.NET': /ASP\.NET/,
        'Nette': /Nette Framework/
    },
    'server': {
        'Tengine': /Tengine(.*)/,
        'Apache': /Apache[^-]?\/?(.*)/,
        'Tomcat': /Apache-Coyote\/?.*/,
        'GitHub': /GitHub.com/,
        'Domino': /Lotus-Domino/,
        'Play': /Play\/?(.*)/,
        'nginx': /nginx\/?(.*)/,
        'IIS': /Microsoft-IIS\/?(.*)/,
        'AliyunOSS': /AliyunOSS\/?(.*)/,
        'cloudflare': /cloudflare\/?(.*)/,
    },
    'via': {
        'Varnish': /(.*) varnish/
    }
};

// Scans through the headers finding matches, and returning the val from appinfo (apps.js)
var headerDetector = function(headers) {
    var appsFound = [];
    headers = headers || [];

    // loop through all the headers received
    for (var i = headers.length - 1; i >= 0; i--) {
        var apps = knownHeaders[headers[i].name.toLowerCase()];
        if (!apps) {
            continue;
        }
        for (var app in apps) {
            var matches = headers[i].value.match(apps[app]);
            if (matches) {
                var version = matches[1] || -1;
                appsFound[app] = version;
            }
        }
    }

    return appsFound;
};

// collect apps from header information:
chrome.webRequest.onHeadersReceived.addListener(function(details) {
    if (details.tabId < 0) {
        return;
    }

    var appsFound = headerDetector(details.responseHeaders);
    getTabInfo(details.tabId).then(function(thisTab) {
        thisTab['headers'] = appsFound;

        if (thisTab['apps']) {
            for (var header in appsFound) {
                thisTab['apps'][header] = appsFound[header];
            }
        }

        return setTabInfo(details.tabId, thisTab);
    }).catch(console.error);
},
{
    urls: ['<all_urls>'],
    types: ['main_frame']
},
['responseHeaders']);

chrome.tabs.onRemoved.addListener(function(tabId) {
    // free memory
    removeTabInfo(tabId).catch(console.error);
});

function resetTabAction(tabId) {
    chrome.action.setTitle({
        tabId: tabId,
        title: chrome.i18n.getMessage('pageActionTitle')
    });
    chrome.action.disable(tabId);
}

async function handleDetectionResult(request, sender) {
    // 'result' event issued by main.js once app identification is complete
    var tabId = sender.tab && sender.tab.id;

    if (typeof tabId !== 'number') {
        return;
    }

    var thisTab = await getTabInfo(tabId);

    thisTab['apps'] = request.apps || {};

    // load in any apps we discovered from headers:
    for (var header in (thisTab['headers'] || {})) {
        thisTab['apps'][header] = thisTab['headers'][header];
    }

    // change the tab icon
    var mainApp = null;
    var count = 0;

    for (var app in thisTab['apps']) {
        count++;

        if (mainApp === null) {
            mainApp = app;
            continue;
        }
    }

    if (count > 0) {
        var mainAppInfo = appinfo[mainApp];
        if (mainAppInfo) { // lazy bug
            var appTitle = mainAppInfo.title ? mainAppInfo.title: mainApp;

            if (thisTab['apps'][mainApp] != "-1") {
                appTitle = mainApp + ' ' + thisTab['apps'][mainApp];
            }

            chrome.action.setTitle({
                tabId: tabId,
                title: appTitle
            });
        }

        chrome.action.enable(tabId);
    }

    await setTabInfo(tabId, thisTab);
}

function getRemoteDetectorSettings() {
    return chrome.storage.local.get({
        remoteDetectorProvider: 'technologychecker',
        builtwithFreeApiKey: '',
        technologyCheckerApiKey: ''
    });
}

var targetRemoteCategories = [
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

var remoteCategoryAliases = {
    'javascript framework': 'JavaScript Framework',
    'javascript frameworks': 'JavaScript Framework',
    'js framework': 'JavaScript Framework',
    'js frameworks': 'JavaScript Framework',
    'content delivery network': 'Content Delivery Network',
    'content delivery networks': 'Content Delivery Network',
    'cdn': 'Content Delivery Network',
    'cdns': 'Content Delivery Network',
    'security': 'Security',
    'ssl': 'Security',
    'ssl certificates': 'Security',
    'ssl/tls': 'Security',
    'fraud prevention': 'Security',
    'payment': 'Payment Processor',
    'payments': 'Payment Processor',
    'payment processor': 'Payment Processor',
    'payment processors': 'Payment Processor',
    'payment processing': 'Payment Processor',
    'font': 'Font Script',
    'fonts': 'Font Script',
    'font script': 'Font Script',
    'font scripts': 'Font Script',
    'web font': 'Font Script',
    'web fonts': 'Font Script',
    'javascript library': 'JavaScript Library',
    'javascript libraries': 'JavaScript Library',
    'js library': 'JavaScript Library',
    'js libraries': 'JavaScript Library',
    'web framework': 'Web Framework',
    'web frameworks': 'Web Framework',
    'ui framework': 'UI Framework',
    'ui frameworks': 'UI Framework',
    'user interface framework': 'UI Framework',
    'user interface frameworks': 'UI Framework',
    'programming language': 'Programming Language',
    'programming languages': 'Programming Language',
    'language': 'Programming Language',
    'languages': 'Programming Language'
};

function getCategoryName(category) {
    if (!category) {
        return 'Other';
    }

    if (typeof category === 'string') {
        return category;
    }

    return category.name || category.Name || category.GroupName || category.Tag || 'Other';
}

function normalizeRemoteCategory(category) {
    var categoryName = getCategoryName(category);
    var key = categoryName.toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();

    return remoteCategoryAliases[key] || categoryName;
}

function addRemoteTechnology(groups, category, technology) {
    var categoryName = normalizeRemoteCategory(category);
    groups[categoryName] = groups[categoryName] || [];

    var key = technology.name + '|' + (technology.version || '');
    for (var i = 0; i < groups[categoryName].length; i++) {
        if (groups[categoryName][i]._key === key) {
            return;
        }
    }

    technology._key = key;
    groups[categoryName].push(technology);
}

function cleanRemoteGroups(groups) {
    var cleaned = {};

    for (var category in groups) {
        cleaned[category] = groups[category].map(function(item) {
            return {
                name: item.name,
                version: item.version,
                url: item.url,
                confidence: item.confidence,
                summary: item.summary
            };
        });
    }

    return cleaned;
}

function findBuiltWithFreeGroups(data) {
    var found = [];

    function visit(value) {
        if (!value || typeof value !== 'object') {
            return;
        }

        var groups = value.Groups || value.groups;
        if (Array.isArray(groups)) {
            found = found.concat(groups);
        }

        for (var prop in value) {
            if (prop !== 'Groups' && prop !== 'groups') {
                visit(value[prop]);
            }
        }
    }

    visit(data);
    return found;
}

function getBuiltWithCount(item, names) {
    for (var i = 0; i < names.length; i++) {
        var value = item[names[i]];
        if (value !== undefined && value !== null && value !== '') {
            return value;
        }
    }

    return '';
}

function normalizeBuiltWithFreeResult(data) {
    var groups = {};
    var builtWithGroups = findBuiltWithFreeGroups(data);

    for (var i = 0; i < builtWithGroups.length; i++) {
        var group = builtWithGroups[i];
        var groupName = group.Name || group.name || group.Tag || group.tag || 'Other';
        var categories = group.Categories || group.categories || [];

        if (!Array.isArray(categories) || categories.length === 0) {
            addRemoteTechnology(groups, 'Technology Groups', {
                name: groupName,
                version: '',
                url: '',
                confidence: '',
                summary: ''
            });
            continue;
        }

        for (var j = 0; j < categories.length; j++) {
            var category = categories[j];
            var categoryName = category.Name || category.name || category.Tag || category.tag || category.Category || category.category || 'Unknown';
            var live = getBuiltWithCount(category, ['Live', 'live', 'LiveCount', 'liveCount']);
            var dead = getBuiltWithCount(category, ['Dead', 'dead', 'DeadCount', 'deadCount']);
            var latest = category.LastDetected || category.lastDetected || category.LastUpdated || category.lastUpdated || category.Last || category.last || '';
            var summary = [];

            if (live !== '') {
                summary.push('live ' + live);
            }
            if (dead !== '') {
                summary.push('dead ' + dead);
            }
            if (latest) {
                summary.push('updated ' + latest);
            }

            addRemoteTechnology(groups, groupName, {
                name: categoryName,
                version: '',
                url: '',
                confidence: '',
                summary: summary.join(' · ')
            });
        }
    }

    return groups;
}

function normalizeTechnologyCheckerResult(data) {
    var groups = {};
    var result = data.data || data;
    var technologies = result.active_technologies || result.technologies || result.results || [];

    if (!Array.isArray(technologies)) {
        technologies = [];
    }

    for (var i = 0; i < technologies.length; i++) {
        var item = technologies[i];
        var summary = [];

        if (item.first_seen || item.firstSeen) {
            summary.push('first ' + (item.first_seen || item.firstSeen));
        }
        if (item.last_seen || item.lastSeen) {
            summary.push('last ' + (item.last_seen || item.lastSeen));
        }
        if (item.subdomain) {
            summary.push(item.subdomain);
        }

        addRemoteTechnology(groups, item.category || item.Category || 'Other', {
            name: item.name || item.Name,
            version: item.version || item.Version || '',
            url: item.website || item.url || '',
            confidence: item.confidence || '',
            summary: summary.join(' · ')
        });
    }

    return groups;
}

async function queryRemoteTechnologies(pageUrl) {
    var settings = await getRemoteDetectorSettings();
    var provider = settings.remoteDetectorProvider;
    var key = provider === 'builtwith' ? settings.builtwithFreeApiKey : settings.technologyCheckerApiKey;
    var targetUrl = new URL(pageUrl);

    if (targetUrl.protocol !== 'http:' && targetUrl.protocol !== 'https:') {
        throw new Error(chrome.i18n.getMessage('remoteDetectorUnsupportedUrl') || 'Only HTTP and HTTPS pages can be queried.');
    }

    if (!key) {
        throw new Error(chrome.i18n.getMessage('remoteDetectorMissingKey') || 'API key is not configured.');
    }

    var requestUrl;
    var response;
    var data;
    var hostname = targetUrl.hostname;

    if (provider === 'technologychecker') {
        requestUrl = new URL('https://api.technologychecker.io/v1/domain/' + encodeURIComponent(hostname));

        response = await fetch(requestUrl.toString(), {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + key
            }
        });
        data = await response.json();

        if (!response.ok || data.error || (data.message && data.success === false)) {
            throw new Error(data.error || data.message || 'Remote detection failed.');
        }

        return {
            provider: 'TechnologyChecker',
            url: pageUrl,
            groups: cleanRemoteGroups(normalizeTechnologyCheckerResult(data)),
            rawCode: response.status
        };
    }

    requestUrl = new URL('https://api.builtwith.com/free1/api.json');
    requestUrl.searchParams.set('KEY', key);
    requestUrl.searchParams.set('LOOKUP', hostname);

    response = await fetch(requestUrl.toString(), {
        headers: {
            'Accept': 'application/json'
        }
    });
    data = await response.json();

    if (!response.ok || data.error || data.Error) {
        throw new Error(data.error || data.Error || 'Remote detection failed.');
    }

    return {
        provider: 'BuiltWith Free API',
        url: pageUrl,
        groups: cleanRemoteGroups(normalizeBuiltWithFreeResult(data)),
        rawCode: response.status
    };
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.msg == 'result') {
        handleDetectionResult(request, sender).then(function() {
            sendResponse({});
        }).catch(function(error) {
            console.error(error);
            sendResponse({});
        });

        return true;
    } else if (request.msg == 'get') {
        // Request for 'get' comes from the popup page, asking for the list of apps
        getTabInfo(request.tab).then(sendResponse).catch(function(error) {
            console.error(error);
            sendResponse({});
        });

        return true;
    } else if (request.msg == 'remoteDetect') {
        queryRemoteTechnologies(request.url).then(function(result) {
            sendResponse({
                ok: true,
                result: result
            });
        }).catch(function(error) {
            console.error(error);
            sendResponse({
                ok: false,
                error: error.message
            });
        });

        return true;
    }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
    if (changeInfo.status === 'loading') {
        removeTabInfo(tabId).catch(console.error);
        resetTabAction(tabId);
    }
});
