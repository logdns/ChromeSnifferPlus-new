(function() {
    'use strict';

    function t(key) {
        return chrome.i18n.getMessage(key) || key;
    }

    function setStatus(message) {
        document.getElementById('remote_detector_status').textContent = message;
    }

    function restoreOptions() {
        chrome.storage.local.get({
            remoteDetectorProvider: 'technologychecker',
            builtwithFreeApiKey: '',
            technologyCheckerApiKey: ''
        }, function(items) {
            document.getElementById('remote_detector_provider').value = items.remoteDetectorProvider;
            document.getElementById('builtwith_free_api_key').value = items.builtwithFreeApiKey;
            document.getElementById('technology_checker_api_key').value = items.technologyCheckerApiKey;
        });
    }

    function saveOptions() {
        chrome.storage.local.set({
            remoteDetectorProvider: document.getElementById('remote_detector_provider').value,
            builtwithFreeApiKey: document.getElementById('builtwith_free_api_key').value.trim(),
            technologyCheckerApiKey: document.getElementById('technology_checker_api_key').value.trim()
        }, function() {
            setStatus(t('optionsSaved'));
            setTimeout(function() {
                setStatus('');
            }, 1600);
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        restoreOptions();
        document.getElementById('remote_detector_save').addEventListener('click', saveOptions);
    });
})();
