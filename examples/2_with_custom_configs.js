// ==UserScript==
// @name         PageActionsAttacher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @match        https://www.saucedemo.com/*
// @icon         https://wchrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html#nav=c84b1043-636c-416b-8b31-e843e818ee49+editorww.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// ==/UserScript==

/*
  - INSTRUCTIONS:
    - dont change the sections 1, 5
    - change the section 2 for custom configs only (color scheme, debug_mode, etc)
    - you only need to update the sections 3 (add your methods), 4 (setup your methods on the options array)

  - EXAMPLE FEATURES:
    - fill up the form present on the page: https://www.saucedemo.com/ (69-81)
    - setup custom configs (line 39-64)
*/

(async function () {
  'use strict';

  // 1 - SETUP THE PACKAGE CONTENT ON THE PAGE =================================

  const CONFIGS = getConfigsObject();
  const pageActionsAttacherContent = await getFormFillerAssitantContent(CONFIGS);
  if (!pageActionsAttacherContent.content) {
    console.log(`Error loading ${CONFIGS.packageName}`);
    return;
  }

  eval(pageActionsAttacherContent.content); // eslint-disable-line
  const PageActionsAttacher = PageActionsAttacher; // eslint-disable-line

  // 2 - SETUP YOUR INSTANCE ===================================================

  const colorScheme = {
    primary: {
      background: '#4f07ad',
      text: '#fff'
    },
    secondary: {
      background: '#fff',
      hoverBackground: '#ccc',
      text: '#000000',
      border: '#ccc'
    },
    overlay: 'rgba(0, 0, 0, 0.7)',
    boxShadown: 'rgba(0, 0, 0, 0.1)'
  };

  const buttonConfigs = {
    right: '30px',
    bottom: '30px'
  };

  const runConfigs = {
    debug: true,
    typeDelay: 100
  };

  const pageActionsAttacher = new PageActionsAttacher({ colorScheme, buttonConfigs, runConfigs });
  console.log(`loaded ${CONFIGS.packageName} [${pageActionsAttacher.VERSION} - ${pageActionsAttacherContent.method}]`);

  // 3 - CREATE YOUR METHODS HERE ==============================================

  async function fillSauceDemoForm() {
    const browserUtils = pageActionsAttacher.browserUtils();

    await browserUtils.typeOnInputBySelector('input[name="user-name"]', 'standard_user');
    await browserUtils.typeOnInputBySelector('input[name="password"]', 'secret_sauce');
    browserUtils.clickElementByTagAttributeValue('input', 'value', 'Login');

    await browserUtils.delay(3000);
    browserUtils.clickElementBySelector('#react-burger-menu-btn');

    await browserUtils.delay(300);
    browserUtils.clickElementBySelector('#logout_sidebar_link');
  }

  // 4 - ADDING YOUR METHODS TO THE FLOATING BUTTON ============================

  const options = [
    { name: 'show lib helper', action: pageActionsAttacher.help },
    { name: 'fill saucedemo form', action: fillSauceDemoForm }
  ];

  pageActionsAttacher.atach(options);

  // 5 - DONT NEED TO CHANGE AFTER THIS ========================================

  function getConfigsObject() {
    return {
      packageName: 'PageActionsAttacher',
      versionStorageKey: '_ffa_version',
      contentStorageKey: '_ffa_content'
    };
  }

  async function getLatestFormFillerAssistantVersion() {
    const response = await fetch(`https://api.github.com/repos/lucasvtiradentes/page-actions-attacher/tags`);
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
    const response = await fetch(`https://cdn.jsdelivr.net/npm/page-actions-attacher@${versionToDownload}/dist/index.js`);
    const content = await response.text();
    return content;
  }

  async function getFormFillerAssitantContent(configsObj, forceVersion) {
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
      pageActionsAttacher.browserUtils().showToast(`Updated ${configsObj.packageName} from ${cachedVersion} to ${latestVersion}.\nRefresh the page to see the changes!`);
    } else {
      pageActionsAttacher.browserUtils().showToast(`No newer ${configsObj.packageName} version found!`);
    }
  }
})();
