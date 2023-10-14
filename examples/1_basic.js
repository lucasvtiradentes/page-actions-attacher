/* eslint-disable no-undef */

// ==UserScript==
// @name         FormFillerAssistant - Basic
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @match        http://127.0.0.1:5500/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// ==/UserScript==

(async function () {
  'use strict';

  const CONFIGS = {
    sessionStorageContentKey: 'FormFillerAssistant',
    formFillerAssistantVersion: '1.3.0'
  };

  async function getFormFillerAssitantContent() {
    async function getFormFillerAssistantContent(version) {
      const response = await fetch(`https://cdn.jsdelivr.net/npm/form_filler_assistant@${version}/dist/index.js`);
      const content = await response.text();
      sessionStorage.setItem(CONFIGS.sessionStorageContentKey, content);
      return content;
    }

    function getVersionNumber(content) {
      const versionRegex = /version:\s+'([\d.]+)'/;
      const match = content.match(versionRegex);
      return match && match.length > 1 ? match[1] : '';
    }

    const sessionContent = sessionStorage.getItem(CONFIGS.sessionStorageContentKey);
    const sessionContentVersion = getVersionNumber(sessionContent);
    if (sessionContent && sessionContentVersion === CONFIGS.formFillerAssistantVersion) {
      return {
        content: sessionContent,
        method: 'session'
      };
    }

    const downloadedContent = await getFormFillerAssistantContent(CONFIGS.formFillerAssistantVersion);
    return {
      content: downloadedContent,
      method: 'downloaded'
    };
  }

  const formFillerAssistantContent = await getFormFillerAssitantContent();
  if (!formFillerAssistantContent.content) {
    console.log('Error loading FormFillerAssistantContent');
    return;
  }

  eval(formFillerAssistantContent.content); // eslint-disable-line

  // =====================================================================================================

  const FormFiller = FormFillerAssistant; // eslint-disable-line
  const formFiller = new FormFiller();
  console.log(`loaded FormFillerAssistantContent [${formFiller.VERSION} - ${formFillerAssistantContent.method}]`);

  const options = [
    { name: 'show lib helper', action: formFiller.help },
    { name: 'show page input fields', action: () => Array.from(document.querySelectorAll('input')).forEach((el) => console.log(el.getAttribute('name'))) }
  ];

  formFiller.atach(options);
})();
