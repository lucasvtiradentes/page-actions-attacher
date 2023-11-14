import { TColorScheme, TConfigs, TFloatingButtonConfigs } from './types/types';

const classes = {
  floatingContainer: 'ffa_floating_container',
  floatingButton: 'ffa_floating_button',
  optionsContainer: 'ffa_options_container',
  modalContainer: 'ffa_modal_container'
} as const;

const libInfo = {
  name: 'PAGE_ACTIONS_ATTACHER',
  version: '__ROLL_UP_REPLACE_BUILD_VERSION__',
  buildTime: '__ROLL_UP_REPLACE_BUILD_TIME__',
  link: 'https://github.com/lucasvtiradentes/page_actions_attacher',
  temperMonkeyLink: 'https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo',
  initialScript: 'https://github.com/lucasvtiradentes/page_actions_attacher/dist/initial_temper_monkey_script.js'
} as const;

export const CONSTS = {
  classes,
  libInfo
};

// =============================================================================

const colorScheme = {
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
} as const satisfies TColorScheme;

const floatingButton = {
  iconImage: 'https://www.svgrepo.com/show/532994/plus.svg',
  iconColorCss: 'filter: invert(100%);',
  right: '30px',
  bottom: '30px',
  shortcutFn: (event) => event.ctrlKey && event.code === 'Space'
} as const satisfies TFloatingButtonConfigs;

export const CONFIGS = {
  debug: false,
  typeDelay: 0,
  onSpaRouteChange: (newUrl: string) => console.log(`change route to: ${newUrl}`),
  colorScheme,
  floatingButton
} as const satisfies TConfigs;
