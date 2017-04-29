//alert("hello");
//document.body.style.background = 'yellow';
// register the handler
require(['shortcut_handler'], function (shortcutHandler) {
    document.body.addEventListener('keydown', doc_keyDown);
    var lastClickedEmojiTheme = null;


    function doc_keyDown(keys) {
        if (keys.metaKey && keys.keyCode == 69) {
            keys.preventDefault();
            openEmojiForCurrentConversation();
        } else if (emojiPaneIsOpen()) {
            var focused = document.activeElement;

            if (keys.keyCode >= 37 && keys.keyCode <= 40) {
                keys.preventDefault();
                selectEmojiWithKey(keys.keyCode, getEmojiTd(focused));
            } else if (keys.keyCode == 32) { //spacebar
                keys.preventDefault();
                focused.click();
                focused.focus();
            } else if (keys.keyCode == 13) { //enter
                keys.preventDefault();
                openEmojiForCurrentConversation();
            } else if (keys.keyCode == 9) {
                keys.preventDefault();
                emojiThemeActions(keys);
            }

        }
    }

    function emojiPaneIsOpen() {
        var focused = document.activeElement;
        return focused.attributes.getNamedItem("aria-label") !== null
            && focused.attributes.getNamedItem("aria-label").textContent == "Choisir un emoji"
    }

    function openEmojiForCurrentConversation() {

        var focused = document.activeElement;
        var focusedConversation = getFocusedConversationListener(focused);
        if (focusedConversation !== null) {
            clickOnEmojisRef(focusedConversation);
        }
    }

    function getFocusedConversationListener(focused) {

        var conversations = document.body.getElementsByClassName("fbDockChatTabFlyout");
        var focusedConversation = null;

        for (var i = 0; i < conversations.length; i++) {
            var conversation = conversations.item(i);
            if (conversation.contains(focused)) {
                focusedConversation = conversation;
                return focusedConversation;
            }
        }
        return focusedConversation;
    }

    function clickOnEmojisRef(focusedConversation) {
        var emoji_href = focusedConversation.querySelector('[title="Choisir un emoji"]');
        if (emoji_href !== null) {
            var emojisNotAlreadyOpen = getRecentEmoji() === null;
            emoji_href.click();
            if (emojisNotAlreadyOpen) {
                clickOnRecentEmojis();
            }
        }
    }

    function clickOnRecentEmojis() {

        var checkExist = setInterval(function () {
            var recentEmojis = getRecentEmoji();
            if (recentEmojis !== null) {
                clearInterval(checkExist);
                lastClickedEmojiTheme = recentEmojis;
                recentEmojis = recentEmojis.firstElementChild;
                recentEmojis.click();
                selectFirstEmoji();
            }
        }, 10); // check every 10ms
    }

    function getRecentEmoji() {
        return document.body.querySelector('[data-tooltip-content="Envoyés récemment"]');
    }

    function emojiThemeActions(keys) {
        if (lastClickedEmojiTheme === null) lastClickedEmojiTheme = getRecentEmoji();
        var currentTheme = lastClickedEmojiTheme;
        if (keys.keyCode == 9) {
            var newTheme = null;
            if (keys.shiftKey) {
                newTheme = clickPreviousEmojiTheme(currentTheme);
            } else {
                newTheme = clickNextEmojiTheme(currentTheme);
            }
            if (newTheme !== null) {
                newTheme.firstElementChild.click();
                lastClickedEmojiTheme = newTheme;
                selectFirstEmoji();
            }

        }
    }

    function clickNextEmojiTheme(currentTheme) {
        var nextTheme = currentTheme.nextElementSibling;
        if (nextTheme !== null) nextTheme.click();
        return nextTheme;
    }

    function clickPreviousEmojiTheme(currentTheme) {
        var previousTheme = currentTheme.previousElementSibling;
        if (previousTheme !== null) previousTheme.click();
        return previousTheme;
    }

    function selectFirstEmoji() {

        var conversationDock = getFocusedConversationListener(document.activeElement);
        var checkExist = setInterval(function () {
            var emojisDiv = conversationDock.getElementsByClassName('uiContextualLayer uiContextualLayerAboveRight');
            var emojiNode = $(emojisDiv).find('[aria-label="Choisir un emoji"]').first();
            if (emojiNode !== null) {
                clearInterval(checkExist);
                emojiNode.focus();
            }
        }, 10); // check every 10ms

    }

    function getEmojiTd(emojiFocused) {
        do {
            emojiFocused = emojiFocused.parentNode;
        } while (emojiFocused.tagName != "TD");
        return emojiFocused;
    }

    function getEmojiTr(emojiFocused) {
        do {
            emojiFocused = emojiFocused.parentNode;
        } while (emojiFocused.tagName != "TR");
        return emojiFocused;
    }

    function selectEmojiWithKey(keyCode, emojiFocusedTd) {
        switch (keyCode) {
            case 37: // Q
                getPreviousEmoji(emojiFocusedTd);
                break;
            case 38: // Z
                getUpperEmoji(emojiFocusedTd);
                break;
            case 39: // D
                getNextEmoji(emojiFocusedTd);
                break;
            case 40: // S
                getLowerEmoji(emojiFocusedTd);
                break;
        }
    }

    function getPreviousEmoji(emojiFocusedTd) {
        var previousEmoji = emojiFocusedTd.previousElementSibling;
        if (previousEmoji !== null) previousEmoji.querySelector('[aria-label="Choisir un emoji"]').focus();
        return previousEmoji;
    }

    function getNextEmoji(emojiFocusedTd) {
        var nextEmoji = emojiFocusedTd.nextElementSibling;
        if (nextEmoji !== null) nextEmoji.querySelector('[aria-label="Choisir un emoji"]').focus();
        return nextEmoji;
    }

    function getUpperEmoji(emojiFocusedTd) {
        var emojisIndex = emojiFocusedTd.cellIndex;
        var currentTr = getEmojiTr(emojiFocusedTd);
        var previousTr = currentTr.previousElementSibling;
        if (previousTr !== null && previousTr.cells.length >= emojisIndex) {
            var upperEmoji = previousTr.cells.item(emojisIndex);
            if (upperEmoji !== null) upperEmoji.querySelector('[aria-label="Choisir un emoji"]').focus();
            return upperEmoji;
        }
    }

    function getLowerEmoji(emojiFocusedTd) {
        var emojisIndex = emojiFocusedTd.cellIndex;
        var currentTr = getEmojiTr(emojiFocusedTd);
        var nextTr = currentTr.nextElementSibling;
        if (nextTr !== null && nextTr.cells.length >= emojisIndex) {
            var lowerEmoji = nextTr.cells.item(emojisIndex);
            if (lowerEmoji !== null) lowerEmoji.querySelector('[aria-label="Choisir un emoji"]').focus();
            return lowerEmoji;
        }
    }
});