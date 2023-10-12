const FormFillerLib = FormFillerAssistant;

if (!FormFillerLib) {
  console.log('FormFillerAssistant not found, make sure to build before test it!');
} else {
  main(FormFillerLib);
}

// ================================================================================================================

async function main(FormFiller) {
  const dataUtils = new FormFiller.DataUtils();
  const domUtils = new FormFiller.DomUtils();
  const formFiller = new FormFiller.FormFiller();

  // ===========================================================================

  const options = [
    { name: 'Mostrar modal de utils', action: toogleModal },
    { name: 'Promotores - etapa 1', action: () => alert(1) },
    { name: 'Franquias etapa 1', action: () => alert(2) },
    { name: 'Franquias etapa 2', action: () => alert(3) },
    { name: 'Franquias tudo', action: () => alert(4) },
    { name: 'Mostrar inputs da página', action: () => Array.from(document.querySelectorAll('input')).forEach((el) => console.log(el.getAttribute('name'))) }
  ];

  formFiller.init(options);

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

      domUtils.setStorageItem(modalStorageKey, JSON.stringify(generatedData));
      return generatedData;
    };

    const storageData = domUtils.getStorageItem(modalStorageKey);
    const data = modalCount > 1 && storageData ? JSON.parse(storageData) : generateData(dataUtils);

    const getFinalHtmlContent = (dt) => {
      const finalHtmlContent = `
          ${domUtils.generateFormRow('Nome', dt.nome)}
          ${domUtils.generateFormRow('Username', dt.user_name)}
          ${domUtils.generateFormRow('Email', dt.email)}
          ${domUtils.generateFormRow('Nome empresa', dt.nome_empresa)}
          ${domUtils.generateFormRow('Cpf', dt.cpf)}
          ${domUtils.generateFormRow('Cnpj', dt.cnpj)}
          ${domUtils.generateFormRow('Inscricao estadual', dt.inscricao_estadual)}
          ${domUtils.generateFormRow('Telefone', dt.telefone)}
        `;

      return finalHtmlContent;
    };

    const { updateModalContent } = domUtils.getModal('Dados gerados');

    const regeneratedData = () => getFinalHtmlContent(generateData(new FormFiller.DataUtils()));

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
