const PAGE_ACCESS = {
    recent_emojis: {
        fr: '[data-tooltip-content="Envoyés récemment"]'
    },

    choose_emojis: {
        fr: '[aria-label="Choisir un emoji"]'
    },
    choose_emojis_button: {
        fr: '[title="Choisir un emoji"]'
    },
    emojis_pane: {
        fr: 'uiContextualLayer uiContextualLayerAboveRight'
    },
    dock_conversation: {
        fr: 'fbDockChatTabFlyout'
    }
};

var language;

chrome.storage.sync.get({
    defaultLang: 'fr'
}, function(items) {
    language = items.defaultLang;
});