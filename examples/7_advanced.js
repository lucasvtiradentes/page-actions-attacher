// ==UserScript==
// @name         WebpageCustomizer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @match        http://localhost:3000/*
// @match        https://frontend.itworks.develop.uds.com.br/*
// @match        https://frontend.itworks.alfa.uds.com.br/*
// @match        https://frontend.itworks.beta.uds.com.br/*
// @match        https://backoffice.pdv.dev.uds.com.br/*
// @match        https://backoffice.pdv.alfa.uds.com.br/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// ==/UserScript==

/*
  - INSTRUCTIONS:
    - dont change the sections 1, 5
    - change the section 2 for custom configs only (color scheme, debug_mode, etc)
    - you only need to update the sections 3 (add your methods), 4 (setup your methods on the options array)

  - EXAMPLE FEATURES:
    - this example is integrated with the repo [https://github.com/lucasvtiradentes/uds_apps_form_fill_utils]
    - it allow to sync filler methods by different devs on different projects with low effort
    - it has also a header icon to get the latest available options
    - it updates the color schema based on the current project
*/

(async function () {
  'use strict';

  // 1 - SETUP THE PACKAGE CONTENT ON THE PAGE =================================

  const CONFIGS = getConfigsObject();
  const webpageCustomizerContent = await getWebpageCustomizerContent(CONFIGS);
  if (!webpageCustomizerContent.content) {
    console.log(`Error loading ${CONFIGS.packageName}`);
    return;
  }

  eval(webpageCustomizerContent.content); // eslint-disable-line
  const WebpageCustomizer = WebpageCustomizer; // eslint-disable-line

  // 2 - SETUP YOUR INSTANCE ===================================================

  const udsOptionsContent = await getLatestUdsOptions(CONFIGS);
  eval(udsOptionsContent.content); // eslint-disable-line
  const UdsFormFiller = UdsFormFillerAssistant; // eslint-disable-line
  const udsOptionsConfigs = {};
  const udsFormFiller = new UdsFormFiller(udsOptionsConfigs);
  const udsOptions = udsFormFiller.getAvailableOptions();
  console.log(`loaded ${CONFIGS.udsOptionsName} [${udsOptionsContent.method}]`);

  const projectInfo = udsFormFiller.getCurrentProjectInfo();
  const colorScheme = {
    ...projectInfo.colorScheme
  };

  const runConfigs = {
    debug: false
  };

  const webpageCustomizer = new WebpageCustomizer({ runConfigs, colorScheme });
  console.log(`loaded ${CONFIGS.packageName} [${webpageCustomizer.VERSION} - ${webpageCustomizerContent.method}]`);

  // 3 - CREATE YOUR METHODS HERE ==============================================

  async function updateLatestUdsOptions(configsObj) {
    const latestContent = await downloadLatestUdsOptions();
    const cachedVersion = localStorage.getItem(configsObj.udsOptionsContentStorageKey) ?? '';
    const shouldUpdate = latestContent !== cachedVersion;

    if (shouldUpdate) {
      console.log(`found new ${configsObj.udsOptionsName} version`);
      await cacheUdsOptions(configsObj, latestContent);
      webpageCustomizer.browserUtils().showToast(`Updated ${configsObj.udsOptionsName}.\nRefresh the page to see the changes!`);
    } else {
      webpageCustomizer.browserUtils().showToast(`No newer version found!`);
    }
  }

  async function downloadLatestUdsOptions() {
    const branch = 'main';
    const filePath = 'dist/index.js';
    const final_link = `https://api.github.com/repos/lucasvtiradentes/uds_apps_form_fill_utils/contents/${filePath}${branch ? `?ref=${branch}` : ''}`;
    const response = await fetch(final_link, { method: 'get', contentType: 'application/json' });
    const base64Content = JSON.parse(await response.text()).content;
    const decodedString = atob(base64Content);
    return decodedString;
  }

  async function cacheUdsOptions(configsObj, content) {
    localStorage.setItem(configsObj.udsOptionsContentStorageKey, content);
    console.log(`downloaded and cached latest ${configsObj.udsOptionsName} content`);
    return content;
  }

  async function getLatestUdsOptions(configsObj) {
    const cachedContent = localStorage.getItem(configsObj.udsOptionsContentStorageKey) ?? '';

    if (!cachedContent) {
      const downloadedContent = await downloadLatestUdsOptions();
      await cacheUdsOptions(configsObj, downloadedContent);

      return {
        content: downloadedContent,
        method: 'downloaded'
      };
    }

    return {
      content: cachedContent,
      method: 'cached'
    };
  }

  // 4 - ADDING YOUR METHODS TO THE FLOATING BUTTON ============================

  const options = [...udsOptions, { name: 'show lib helper', action: webpageCustomizer.help }];

  const headerOption = [
    { icon: 'https://www.svgrepo.com/show/460136/update-alt.svg', description: 'update formFillerAssistant version', action: () => updateFormFillerAssistantContent(CONFIGS) },
    { icon: 'https://uds.com.br/wp-content/uploads/2021/02/logo-uds.svg', description: 'update udsOptions version', action: () => updateLatestUdsOptions(CONFIGS) }
  ];

  webpageCustomizer.atach(options, headerOption);

  // 5 - DONT NEED TO CHANGE AFTER THIS ========================================

  function getConfigsObject() {
    return {
      packageName: 'WebpageCustomizer',
      versionStorageKey: '_ffa_version',
      contentStorageKey: '_ffa_content',
      udsOptionsName: 'UDS OPTIONS',
      udsOptionsContentStorageKey: '_ffa_uds_options_content'
    };
  }

  async function getLatestFormFillerAssistantVersion() {
    const response = await fetch(`https://api.github.com/repos/lucasvtiradentes/webpage-customizer/tags`);
    const content = await response.text();
    const allTags = content ? JSON.parse(content) : [];
    const latestVersion = allTags.length === 0 ? '' : allTags[0]?.name?.replace('v', '') ?? '';

    if (latestVersion === '') {
      alert('could not retrieve latest version number, please try again latter!');
      return;
    }

    return latestVersion;
  }

  async function downloadFormFillerAssistantContent(versionToDownload) {
    const response = await fetch(`https://cdn.jsdelivr.net/npm/webpage-customizer@${versionToDownload}/dist/index.js`);
    const content = await response.text();
    return content;
  }

  async function getWebpageCustomizerContent(configsObj, forceVersion) {
    const cachedContent = localStorage.getItem(configsObj.contentStorageKey) ?? '';
    const cachedVersion = localStorage.getItem(configsObj.versionStorageKey) ?? '';

    if (!cachedContent || !cachedVersion) {
      const latestVersion = await getLatestFormFillerAssistantVersion();
      const content = await downloadAndCacheVersion(configsObj, latestVersion);
      return {
        content: content,
        method: 'initial'
      };
    }

    if (forceVersion && forceVersion !== cachedVersion) {
      const content = await downloadAndCacheVersion(configsObj, forceVersion);
      return {
        content: content,
        method: 'forced_version'
      };
    }

    return {
      content: cachedContent,
      method: 'cached'
    };
  }

  async function downloadAndCacheVersion(configsObj, version) {
    const content = await downloadFormFillerAssistantContent(version);
    localStorage.setItem(configsObj.contentStorageKey, content);
    localStorage.setItem(configsObj.versionStorageKey, version);
    console.log(`downloaded and cached ${configsObj.packageName} version ${version}`);

    return content;
  }

  async function updateFormFillerAssistantContent(configsObj) {
    const isVersionLower = (versionA, versionB) => versionA < versionB;
    const latestVersion = await getLatestFormFillerAssistantVersion();
    const cachedVersion = localStorage.getItem(configsObj.versionStorageKey) ?? '';
    const shouldUpdate = cachedVersion === '' || isVersionLower(cachedVersion, latestVersion);

    if (shouldUpdate) {
      console.log(`found new ${configsObj.packageName} version: ${latestVersion}`);
      await downloadAndCacheVersion(configsObj, latestVersion);
      webpageCustomizer.browserUtils().showToast(`Updated from ${cachedVersion} to ${latestVersion}.\nRefresh the page to see the changes!`);
    } else {
      webpageCustomizer.browserUtils().showToast(`No newer version found!`);
    }
  }
})();
