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
    shortcutFn: (event: KeyboardEvent) => boolean;
};
export type TConfigs = {
    debug: boolean;
    typeDelay: number;
    onSpaRouteChange: (newUrl: string) => void;
    colorScheme: TColorScheme;
    floatingButton: TFloatingButtonConfigs;
};
