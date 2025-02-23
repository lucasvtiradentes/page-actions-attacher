export declare const CONSTS: {
    classes: {
        readonly floatingContainer: "ffa_floating_container";
        readonly floatingButton: "ffa_floating_button";
        readonly optionsContainer: "ffa_options_container";
        readonly modalContainer: "ffa_modal_container";
    };
    libInfo: {
        readonly name: "PAGE_ACTIONS_ATTACHER";
        readonly version: "1.12.3";
        readonly buildTime: "23/02/2025 11:43:27";
        readonly link: "https://github.com/lucasvtiradentes/page-actions-attacher";
        readonly temperMonkeyLink: "https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo";
        readonly initialScript: "https://github.com/lucasvtiradentes/page-actions-attacher/dist/initial_temper_monkey_script.js";
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
