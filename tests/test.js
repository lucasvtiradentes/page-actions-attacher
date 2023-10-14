const FormFillerLib = FormFillerAssistant;

if (!FormFillerLib) {
  console.log('FormFillerAssistant not found, make sure to build before test it!');
} else {
  main(FormFillerLib);
}

// ================================================================================================================

async function main(FormFiller) {
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

  const formFiller = new FormFiller({});
  const browserUtils = formFiller.browserUtils();

  // ===========================================================================

  const options = [
    { name: 'show modal utils', action: toogleModal },
    { name: 'show lib helper', action: () => formFiller.help() },
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

      browserUtils.setStorageItem(modalStorageKey, JSON.stringify(generatedData));
      return generatedData;
    };

    const storageData = browserUtils.getStorageItem(modalStorageKey);
    const data = modalCount > 1 && storageData ? JSON.parse(storageData) : generateData(formFiller.dataUtils());

    const getFinalHtmlContent = (dt) => {
      const finalHtmlContent = `
          ${browserUtils.generateFormRow('Nome', dt.nome)}
          ${browserUtils.generateFormRow('Username', dt.user_name)}
          ${browserUtils.generateFormRow('Email', dt.email)}
          ${browserUtils.generateFormRow('Nome empresa', dt.nome_empresa)}
          ${browserUtils.generateFormRow('Cpf', dt.cpf)}
          ${browserUtils.generateFormRow('Cnpj', dt.cnpj)}
          ${browserUtils.generateFormRow('Inscricao estadual', dt.inscricao_estadual)}
          ${browserUtils.generateFormRow('Telefone', dt.telefone)}
        `;

      return finalHtmlContent;
    };

    const { updateModalContent } = browserUtils.getModal('Dados gerados');

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
}
