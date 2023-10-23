export declare const CONSTS: {
    classes: {
        readonly floatingContainer: "ffa_floating_container";
        readonly floatingButton: "ffa_floating_button";
        readonly optionsContainer: "ffa_options_container";
        readonly modalContainer: "ffa_modal_container";
    };
    libInfo: {
        readonly name: "FORM_FILLER_ASSISTANT";
        readonly version: "1.11.0";
        readonly buildTime: "23/10/2023 00:04:05";
        readonly link: "https://github.com/lucasvtiradentes/form_filler_assistant";
        readonly temperMonkeyLink: "https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo";
        readonly initialScript: "https://github.com/lucasvtiradentes/form_filler_assistant/dist/initial_temper_monkey_script.js";
    };
};
export declare const CONFIGS: {
    readonly debug: false;
    readonly typeDelay: 0;
    readonly onSpaRouteChange: (newUrl: string) => void;
    readonly colorScheme: {
        readonly primary: {
            readonly background: "#0074D9";
            readonly text: "#fff";
        };
        readonly secondary: {
            readonly background: "#fff";
            readonly hoverBackground: "#ccc";
            readonly text: "#000000";
            readonly border: "#ccc";
        };
        readonly overlay: "rgba(0, 0, 0, 0.7)";
        readonly boxShadown: "rgba(0, 0, 0, 0.1)";
    };
    readonly floatingButton: {
        readonly iconImage: "https://www.svgrepo.com/show/532994/plus.svg";
        readonly iconColorCss: "filter: invert(100%);";
        readonly right: "30px";
        readonly bottom: "30px";
        readonly shortcutFn: (event: KeyboardEvent) => boolean;
    };
};
