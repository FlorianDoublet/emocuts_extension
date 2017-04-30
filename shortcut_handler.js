
const defaultOptions = {
    osKey: '❖',
    ctrl: 'Ctrl',
    alt: 'Alt',
    shift: '⇧',
    joinWith: ' + '
};

const macOptions = {
    osKey: "⌘",
    ctrl: "⌃",
    alt: "⌥",
    shift: "⇧",
    joinWith: " + "
};

const options = (navigator.appVersion.indexOf("Mac")!=-1) ? Object.assign(macOptions): Object.assign(defaultOptions);

var keyMap = {
    8: 'Backspace',
    9: 'Tab',
    13: 'Enter',
    27: 'Escape',
    32: 'Space',
    36: 'Home',
    33: 'Page Up',
    34: 'Page Down',
    35: 'End',
    37: 'Left',
    38: 'Up',
    39: 'Right',
    40: 'Down',
    46: 'Delete',
    186: ';',
    187: '=',
    188: ',',
    189: '-',
    190: '.',
    192: '`',
    222: "'"
};

function buildKeyMap (e) {
    var isOnlyModifier = [16, 17, 18, 91, 93, 224].indexOf(e.keyCode) !== -1
    var character = isOnlyModifier ? null : e.keyCode;

    return {
        character: character,
        keyCode: e.keyCode,
        modifiers: {
            osKey: e.metaKey,
            ctrl: e.ctrlKey,
            alt: e.altKey,
            shift: e.shiftKey
        }
    }
}

function buildKeyArray (map) {
    var modifiers = map.modifiers;

    var result = [];

    if (modifiers.osKey) result.push(options.osKey);
    if (modifiers.ctrl) result.push(options.ctrl);
    if (modifiers.alt) result.push(options.alt);
    if (modifiers.shift) result.push(options.shift);
    if (map.character) result.push(keyMap[map.character] || String.fromCharCode(map.character));

    return result;
}

function eventKeyToString (e) {
    var keyMap = buildKeyMap(e);
    var modifiers = keyMap.modifiers;
    var result = buildKeyArray(keyMap);
    var event_to_string = result.join(options.joinWith);
    return {
        event_to_string: event_to_string,
        pushed_keys: {
            keyCode: keyMap.keyCode,
            metaKey: modifiers.osKey,
            ctrlKey: modifiers.ctrl,
            altKey: modifiers.alt,
            shiftKey: modifiers.shift
        }
    }
}


const defaultOpenEmojisShortcut = { // Meta + E
    keyCode: 69,
    metaKey: true,
    ctrlKey: false,
    altKey: false,
    shiftKey: false
};

const defaultUpShortcut = { // UP ARROW
    keyCode: 38,
    metaKey: false,
    ctrlKey: false,
    altKey: false,
    shiftKey: false
};

const defaultDownShortcut = { // DOWN ARROW
    keyCode: 40,
    metaKey: false,
    ctrlKey: false,
    altKey: false,
    shiftKey: false
};

const defaultRightShortcut = { // -->
    keyCode: 37,
    metaKey: false,
    ctrlKey: false,
    altKey: false,
    shiftKey: false
};

const defaultLeftShortcut = { // <--
    keyCode: 39,
    metaKey: false,
    ctrlKey: false,
    altKey: false,
    shiftKey: false

};

const defaultNextShortcut = { // tab
    keyCode: 9,
    metaKey: false,
    ctrlKey: false,
    altKey: false,
    shiftKey: false
};

const defaultPreviousShortcut = { // tab + shift
    keyCode: 9,
    metaKey: false,
    ctrlKey: false,
    altKey: false,
    shiftKey: true
};

const defaultValidateShortcut = { // enter
    keyCode: 13,
    metaKey: false,
    ctrlKey: false,
    altKey: false,
    shiftKey: false
};

const defaultAddShortcut = { //spacebar
    keyCode: 32,
    metaKey: false,
    ctrlKey: false,
    altKey: false,
    shiftKey: false
};

const defaultShortcuts = {
    up: defaultUpShortcut,
    down: defaultDownShortcut,
    left: defaultLeftShortcut,
    right: defaultRightShortcut,
    openEmojis: defaultOpenEmojisShortcut,
    next: defaultNextShortcut,
    previous: defaultPreviousShortcut,
    validate: defaultValidateShortcut,
    add: defaultAddShortcut
};

function shortcutEq(sh1, sh2){
    return sh1.keyCode == sh2.keyCode
        && sh1.metaKey == sh2.metaKey
        && sh1.ctrlKey == sh2.ctrlKey
        && sh1.altKey == sh2.altKey
        && sh1.shiftKey == sh2.shiftKey;
}

var shortcutHandler = {
    eventKeyToString: function(e) {
        return eventKeyToString(e);
    },
    defaultShortcuts: defaultShortcuts
};


