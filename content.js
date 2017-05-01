// register the handler
document.body.addEventListener('keydown', doc_keyDown);

var lastClickedEmojiTheme = null;
const defaults = shortcutHandler.defaultShortcuts;

// shortcut var
var openEmojis_sh;
var up_sh;
var down_sh;
var right_sh;
var left_sh;
var next_sh;
var previous_sh;
var add_sh;
var validate_sh;

load_shortcuts();

function load_shortcuts(){
    chrome.storage.local.set({
        shortcuts_changed: false
    }, function () {
    });

    chrome.storage.local.get({
        openEmojis_sh: defaults.openEmojis,
        up_sh: defaults.up,
        down_sh: defaults.down,
        right_sh: defaults.right,
        left_sh: defaults.left,
        next_sh: defaults.next,
        previous_sh: defaults.previous,
        validate_sh: defaults.validate,
        add_sh: defaults.add

    }, function(items) {
        openEmojis_sh = items.openEmojis_sh;
        up_sh = items.up_sh;
        down_sh = items.down_sh;
        right_sh = items.right_sh;
        left_sh = items.left_sh;
        next_sh = items.next_sh;
        previous_sh = items.previous_sh;
        add_sh = items.add_sh;
        validate_sh = items.validate_sh;
    });
}

function doc_keyDown(keys) {

    const pushed_keys = shortcutHandler.eventKeyToString(keys).pushed_keys;

    chrome.storage.local.get({
        shortcuts_changed: false
    }, function(items){
        if(items.shortcuts_changed){
            load_shortcuts();
        }
    });
    if(shortcutEq(pushed_keys, openEmojis_sh)){
        keys.preventDefault();
        openEmojiForCurrentConversation();
    } else if (emojiPaneIsOpen()){
        var focused = document.activeElement;
        keys.preventDefault();

        if(shortcutEq(pushed_keys, up_sh)){
            getUpperEmoji(getEmojiTd(focused));
        } else if(shortcutEq(pushed_keys, down_sh)){
            getLowerEmoji(getEmojiTd(focused));
        } else if(shortcutEq(pushed_keys, right_sh)){
            getPreviousEmoji(getEmojiTd(focused));
        } else if(shortcutEq(pushed_keys, left_sh)){
            getNextEmoji(getEmojiTd(focused));
        } else if(shortcutEq(pushed_keys, next_sh) || shortcutEq(pushed_keys, previous_sh)){
            emojiThemeActions(pushed_keys);
        } else if(shortcutEq(pushed_keys, previous_sh)){
            emojiThemeActions(pushed_keys);
        } else if(shortcutEq(pushed_keys, add_sh)){
            focused.click();
            focused.focus();
        } else if(shortcutEq(pushed_keys, validate_sh)){
            openEmojiForCurrentConversation();
        }
    }
}

function emojiPaneIsOpen() {
    return document.activeElement.parentNode.querySelector(PAGE_ACCESS.choose_emojis[language]) !== null;
}

function openEmojiForCurrentConversation() {

    var focused = document.activeElement;
    var focusedConversation = getFocusedConversationListener(focused);
    if (focusedConversation !== null) {
        clickOnEmojisRef(focusedConversation);
    }
}

function getFocusedConversationListener(focused) {

    var conversations = document.body.getElementsByClassName(PAGE_ACCESS.dock_conversation[language]);
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
    var emoji_href = focusedConversation.querySelector(PAGE_ACCESS.choose_emojis_button[language]);
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
    return document.body.querySelector(PAGE_ACCESS.recent_emojis[language]);
}

function emojiThemeActions(pushed_keys) {
    if (lastClickedEmojiTheme === null) lastClickedEmojiTheme = getRecentEmoji();
    var currentTheme = lastClickedEmojiTheme;

    var newTheme = null;
    if (shortcutEq(pushed_keys, previous_sh)) {
        newTheme = clickPreviousEmojiTheme(currentTheme);
    } else if (shortcutEq(pushed_keys, next_sh)) {
        newTheme = clickNextEmojiTheme(currentTheme);
    }
    if (newTheme !== null) {
        newTheme.firstElementChild.click();
        lastClickedEmojiTheme = newTheme;
        selectFirstEmoji();
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
        var emojisDiv = conversationDock.getElementsByClassName(PAGE_ACCESS.emojis_pane[language]);
        var emojiNode = $(emojisDiv).find(PAGE_ACCESS.choose_emojis[language]).first();
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

function getPreviousEmoji(emojiFocusedTd) {
    var previousEmoji = emojiFocusedTd.previousElementSibling;
    if (previousEmoji !== null) previousEmoji.querySelector(PAGE_ACCESS.choose_emojis[language]).focus();
    return previousEmoji;
}

function getNextEmoji(emojiFocusedTd) {
    var nextEmoji = emojiFocusedTd.nextElementSibling;
    if (nextEmoji !== null) nextEmoji.querySelector(PAGE_ACCESS.choose_emojis[language]).focus();
    return nextEmoji;
}

function getUpperEmoji(emojiFocusedTd) {
    var emojisIndex = emojiFocusedTd.cellIndex;
    var currentTr = getEmojiTr(emojiFocusedTd);
    var previousTr = currentTr.previousElementSibling;
    if (previousTr !== null && previousTr.cells.length >= emojisIndex) {
        var upperEmoji = previousTr.cells.item(emojisIndex);
        if (upperEmoji !== null) upperEmoji.querySelector(PAGE_ACCESS.choose_emojis[language]).focus();
        return upperEmoji;
    }
}

function getLowerEmoji(emojiFocusedTd) {
    var emojisIndex = emojiFocusedTd.cellIndex;
    var currentTr = getEmojiTr(emojiFocusedTd);
    var nextTr = currentTr.nextElementSibling;
    if (nextTr !== null && nextTr.cells.length >= emojisIndex) {
        var lowerEmoji = nextTr.cells.item(emojisIndex);
        if (lowerEmoji !== null) lowerEmoji.querySelector(PAGE_ACCESS.choose_emojis[language]).focus();
        return lowerEmoji;
    }
}
