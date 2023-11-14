const PageActionsLib = PageActionsAttacher;

if (!PageActionsLib) {
  console.log('PageActionsAttacher not found, make sure to build before test it!');
} else {
  main(PageActionsLib);
}

// ================================================================================================================

async function main(PageActionsAttacher) {
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

  const floatingButton = {
    right: '30px',
    bottom: '30px'
  };

  const onSpaRouteChange = (newUrl) => console.log(`URL changed to ${newUrl}!`);

  const formFillerConfigs = {
    debug: true,
    typeDelay: 500,
    onSpaRouteChange,
    colorScheme,
    floatingButton
  };

  const pageActionsAttacher = new PageActionsAttacher(formFillerConfigs);

  // ===========================================================================

  function showToast() {
    pageActionsAttacher.browserUtils().showToast('Simple toast message!');
  }

  function toogleSimpleModal() {
    const { updateModalContent } = pageActionsAttacher.browserUtils().getModal('Simple modal');

    const modalHtml = '<p>HTML modal content</p>';
    const modalButtons = [
      {
        title: 'Confirm',
        action: () => alert('you have confirmed!')
      }
    ];

    updateModalContent(modalHtml, modalButtons);
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
        inscricao_estadual: dt.generateNRandomNumber(5),
        telefone: dt.generateNRandomNumber(8)
      };

      sessionStorage.setItem(modalStorageKey, JSON.stringify(generatedData));
      return generatedData;
    };

    const storageData = sessionStorage.getItem(modalStorageKey);
    const data = modalCount > 1 && storageData ? JSON.parse(storageData) : generateData(pageActionsAttacher.dataUtils());

    const { updateModalContent, closeModal } = pageActionsAttacher.browserUtils().getModal('Advanced modal!');

    const getFinalHtmlContent = (dt) => {
      const items = [
        ['Name', dt.nome],
        ['Username', dt.user_name],
        ['Email', dt.nome_empresa],
        ['Cpf', dt.cpf],
        ['Cnpj', dt.cnpj],
        ['Inscricao estadual', dt.inscricao_estadual],
        ['Telefone', dt.telefone]
      ];
      const finalHTML = items.map((item) => `${pageActionsAttacher.browserUtils().generateFormRow(item[0], item[1], closeModal)}`).join('');
      return finalHTML;
    };

    const regeneretadHtmlContent = () => getFinalHtmlContent(generateData(new PageActionsAttacher().dataUtils()));

    const modalButtons = [
      {
        title: 'Regenerate',
        action: () => updateModalContent(regeneretadHtmlContent(), modalButtons),
        exitAfterAction: false
      }
    ];

    const initialHTML = getFinalHtmlContent(data);

    updateModalContent(initialHTML, modalButtons);
  }

  // ===========================================================================

  const bodyOptions = [
    { name: 'show lib helper', action: () => pageActionsAttacher.help() },
    { name: 'show advanced modal', action: toogleModal },
    { name: 'show simple modal', action: toogleSimpleModal },
    { name: 'show simple toast', action: showToast }
  ];

  const headerOptions = [{ icon: 'https://www.svgrepo.com/show/460136/update-alt.svg', description: 'update PageActionsAttacher', action: () => alert(1) }];

  pageActionsAttacher.attach({ bodyOptions, headerOptions });
}
