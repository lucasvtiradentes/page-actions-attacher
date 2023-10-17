import { TFloatingButtonConfigs, TColorScheme, TRunConfigs } from './types/types';
export declare const CONFIGS: {
    colorScheme: TColorScheme;
    buttonConfigs: TFloatingButtonConfigs;
    classes: {
        readonly floatingButton: "ffa_floating_container";
        readonly optionsContainer: "ffa_options_container";
        readonly modalContainer: "ffa_modal_container";
    };
    libInfo: {
        name: string;
        version: string;
        buildTime: string;
        link: string;
        temperMonkeyLink: string;
        initialScript: string;
    };
    runConfigs: TRunConfigs;
};
