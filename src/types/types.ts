export type TModalButton = {
  title: string;
  action: () => void;
  exitAfterAction: boolean;
};

export type TListOptionItem = {
  name: string;
  action: () => void;
};

export type THeaderOptionItem = {
  icon: string;
  action: () => void;
  description: string;
  cssStyle?: string;
};

export type TColorScheme = {
  primary: {
    background: string;
    text: string;
  };
  secondary: {
    background: string;
    hoverBackground: string;
    text: string;
    border: string;
  };
  overlay: string;
  boxShadown: string;
};

export type TFloatingButtonConfigs = {
  iconImage: string;
  iconColorCss: string;
  right: string;
  bottom: string;
};

export type TRunConfigs = {
  debug: boolean;
  typeDelay: number;
  shortcutFn: (e: KeyboardEvent) => boolean;
};
