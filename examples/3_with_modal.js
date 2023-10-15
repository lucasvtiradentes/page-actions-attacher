// ==UserScript==
// @name         FormFillerAssistant
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
    - fill up the form present on the page: https://www.saucedemo.com/ (71-83)
    - setup custom configs (line 41-66)
    - setup update header option (line 153)
    - add a simple modal option (line 91-142)
*/

(async function () {
  'use strict';

  // 1 - SETUP THE PACKAGE CONTENT ON THE PAGE =================================

  const CONFIGS = getConfigsObject();
  const formFillerAssistantContent = await getFormFillerAssitantContent(CONFIGS);
  if (!formFillerAssistantContent.content) {
    console.log(`Error loading ${CONFIGS.packageName}`);
    return;
  }

  eval(formFillerAssistantContent.content); // eslint-disable-line
  const FormFiller = FormFillerAssistant; // eslint-disable-line

  // 2 - CREATEA A NEW INSTANCE ================================================

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

  const formFiller = new FormFiller({ colorScheme, buttonConfigs, runConfigs });
  console.log(`loaded ${CONFIGS.packageName} [${formFiller.VERSION} - ${formFillerAssistantContent.method}]`);

  // 3 - CREATE YOUR METHODS HERE ==============================================

  async function fillSauceDemoForm() {
    const browserUtils = formFiller.browserUtils();

    await browserUtils.typeOnInputBySelector('input[name="user-name"]', 'standard_user');
    await browserUtils.typeOnInputBySelector('input[name="password"]', 'secret_sauce');
    browserUtils.clickTagByAttributeValue('input', 'value', 'Login');

    await browserUtils.delay(3000);
    browserUtils.clickBySelector('#react-burger-menu-btn');

    await browserUtils.delay(300);
    browserUtils.clickBySelector('#logout_sidebar_link');
  }

  function showPageInputNames() {
    Array.from(document.querySelectorAll('input')).forEach((el) => console.log(el.getAttribute('name')));
  }

  let modalCount = 0;

  function toogleModal() {
    const modalStorageKey = 'modalData';
    modalCount = modalCount + 1;

    const generateData = (dt) => {
      const generatedData = {
        nome: dt.generatePersonName(),
        user_name: dt.generatePersonUsername(),
        email: dt.generatePersonEmail(),
        nome_empresa: dt.generateCompanyName(),
        cpf: dt.generateCPF(),
        cnpj: dt.generateCNPJ(),
        inscricao_estadual: dt.generateNRandomNumbers(5),
        telefone: dt.generateNRandomNumbers(8)
      };

      formFiller.browserUtils().setStorageItem(modalStorageKey, JSON.stringify(generatedData));
      return generatedData;
    };

    const storageData = formFiller.browserUtils().getStorageItem(modalStorageKey);
    const data = modalCount > 1 && storageData ? JSON.parse(storageData) : generateData(formFiller.dataUtils());

    const getFinalHtmlContent = (dt) => {
      const finalHtmlContent = `
          ${formFiller.browserUtils().generateFormRow('Nome', dt.nome)}
          ${formFiller.browserUtils().generateFormRow('Username', dt.user_name)}
          ${formFiller.browserUtils().generateFormRow('Email', dt.email)}
          ${formFiller.browserUtils().generateFormRow('Nome empresa', dt.nome_empresa)}
          ${formFiller.browserUtils().generateFormRow('Cpf', dt.cpf)}
          ${formFiller.browserUtils().generateFormRow('Cnpj', dt.cnpj)}
          ${formFiller.browserUtils().generateFormRow('Inscricao estadual', dt.inscricao_estadual)}
          ${formFiller.browserUtils().generateFormRow('Telefone', dt.telefone)}
        `;

      return finalHtmlContent;
    };

    const { updateModalContent } = formFiller.browserUtils().getModal('Dados gerados');

    const regeneratedData = () => getFinalHtmlContent(generateData(new FormFiller().dataUtils()));

    const modalButtons = [
      {
        title: 'Regenerate',
        action: () => updateModalContent(regeneratedData(), modalButtons),
        exitAfterAction: false
      }
    ];

    updateModalContent(getFinalHtmlContent(data), modalButtons);
  }

  // 4 - ADDING YOUR METHODS TO THE FLOATING BUTTON ============================

  const options = [
    { name: 'show lib helper', action: formFiller.help },
    { name: 'fill saucedemo form', action: fillSauceDemoForm },
    { name: 'show modal utils', action: toogleModal },
    { name: 'show page inputs names', action: showPageInputNames }
  ];

  formFiller.atach(options, () => updateFormFillerAssistantContent(CONFIGS));

  // 5 - DONT NEED TO CHANGE AFTER THIS ========================================

  function getConfigsObject() {
    return {
      packageName: 'FormFillerAssistant',
      versionStorageKey: 'form_filler_assistant_version',
      contentStorageKey: 'form_filler_assistant_content'
    };
  }

  async function getLatestFormFillerAssistantVersion() {
    const response = await fetch(`https://api.github.com/repos/lucasvtiradentes/form_filler_assistant/tags`);
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
    const response = await fetch(`https://cdn.jsdelivr.net/npm/form_filler_assistant@${versionToDownload}/dist/index.js`);
    const content = await response.text();
    return content;
  }

  async function getFormFillerAssitantContent(configsObj, forceVersion) {
    const cachedContent = localStorage.getItem(configsObj.contentStorageKey) ?? '';
    const cachedVersion = localStorage.getItem(configsObj.versionStorageKey) ?? '';

    const isInitialRun = !cachedContent || !cachedVersion;
    const isForcedVersion = forceVersion && forceVersion !== cachedVersion;

    if (isInitialRun || isForcedVersion) {
      const finalVersion = forceVersion ? forceVersion : await getLatestFormFillerAssistantVersion();
      const content = await downloadAndCacheVersion(configsObj, finalVersion);
      return {
        content: content,
        method: isInitialRun ? 'initial' : 'forced_version'
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
      alert(`updated ${configsObj.packageName} from ${cachedVersion} to ${latestVersion}.\n refresh the page to see the changes!`);
    } else {
      alert(`you are using the latest ${configsObj.packageName} version`);
    }
  }
})();
