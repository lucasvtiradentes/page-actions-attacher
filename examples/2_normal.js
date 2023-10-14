/* eslint-disable no-undef */

// ==UserScript==
// @name         FormFillerAssistant - Intermediate
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

  const FormFiller = FormFillerAssistant; // eslint-disable-line
  const formFiller = new FormFiller({ colorScheme, buttonConfigs });
  console.log(`loaded FormFillerAssistantContent [${formFiller.VERSION} - ${formFillerAssistantContent.method}]`);

  const options = [
    { name: 'show modal utils', action: toogleModal },
    { name: 'show lib helper', action: formFiller.help },
    { name: 'show page input fields', action: () => Array.from(document.querySelectorAll('input')).forEach((el) => console.log(el.getAttribute('name'))) }
  ];

  formFiller.atach(options);

  // ===========================================================================

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
})();
