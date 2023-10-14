import { TButtonConfigs, TColorScheme } from './types/types';

const colorScheme: TColorScheme = {
  primary: {
    background: '#0074D9',
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

const buttonConfigs: TButtonConfigs = {
  iconImage: 'https://www.svgrepo.com/show/532994/plus.svg',
  iconColorCss: 'filter: invert(100%);',
  right: '30px',
  bottom: '30px'
};

const classes = {
  floatingButton: 'ffa_floating_container',
  optionsContainer: 'ffa_options_container',
  modalContainer: 'ffa_modal_container'
};

const libInfo = {
  name: 'FORM_FILLER_ASSISTANT',
  version: '__ROLL_UP_REPLACE_BUILD_VERSION__',
  buildTime: '__ROLL_UP_REPLACE_BUILD_TIME__',
  link: 'https://github.com/lucasvtiradentes/form_filler_assistant',
  temperMonkeyLink: 'https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo',
  initialScript: 'https://github.com/lucasvtiradentes/form_filler_assistant/dist/initial_temper_monkey_script.js'
};

export const CONFIGS = {
  colorScheme,
  buttonConfigs,
  classes,
  libInfo
};
