
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('restore').addEventListener('click', restore_defaults);
document.body.addEventListener('keydown', doc_keyDown);

const defaults = shortcutHandler.defaultShortcuts;
// Saves options to chrome.storage.sync.
function save_options() {

    chrome.storage.sync.get({
        preOpenEmojis: defaults.openEmojis,
        preUp: defaults.up,
        preDown: defaults.down,
        preLeft: defaults.left,
        preRight: defaults.right,
        preNext: defaults.next,
        prePrevious: defaults.previous

    }, function(items) {
        chrome.storage.sync.set({
            openEmojis_sh: items.preOpenEmojis,
            up_sh: items.preUp,
            down_sh: items.preDown,
            right_sh: items.preRight,
            left_sh: items.preLeft,
            nex_sh: items.preNext,
            previous_sh: items.prePrevious
        }, function () {
            // Update status to let user know options were saved.
            removeEditedInputsClass();
            var status = document.getElementById('status-save');
            $(status).fadeIn();
            setTimeout(function () {
                $(status).fadeOut();
            }, 2000);
        });

    });

}

function removeEditedInputsClass(){
    var editedInputs = document.getElementsByClassName('edited');
    for(var i = 0; i < editedInputs.length; i++)
    {
        $(editedInputs.item(i)).removeClass('edited');
    }
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {

    chrome.storage.sync.get({
        openEmojis_sh: defaults.openEmojis,
        up_sh: defaults.up,
        down_sh: defaults.down,
        right_sh: defaults.right,
        left_sh: defaults.left,
        next_sh: defaults.next,
        previous_sh: defaults.previous

    }, function(items) {
        document.getElementById('up').value = shortcutHandler.eventKeyToString(items.up_sh).event_to_string;
        document.getElementById('down').value = shortcutHandler.eventKeyToString(items.down_sh).event_to_string;
        document.getElementById('left').value = shortcutHandler.eventKeyToString(items.left_sh).event_to_string;
        document.getElementById('right').value = shortcutHandler.eventKeyToString(items.right_sh).event_to_string;
        document.getElementById('next').value = shortcutHandler.eventKeyToString(items.next_sh).event_to_string;
        document.getElementById('previous').value = shortcutHandler.eventKeyToString(items.previous_sh).event_to_string;
        document.getElementById('open-emojis').value = shortcutHandler.eventKeyToString(items.openEmojis_sh).event_to_string;
    });
}

function doc_keyDown(keys){
    keys.preventDefault();
    var focused = document.activeElement;
    if(focused.className.includes("shortcut")){
        const parsedEvent = shortcutHandler.eventKeyToString(keys);
        focused.value = parsedEvent.event_to_string;
        $(focused).addClass('edited');
        savePreOptions(focused.getAttribute('id'), parsedEvent.pushed_keys);
    }
}

function savePreOptions(elementId, map){
    switch(elementId){
        case 'up':
            chrome.storage.sync.set({
                preUp: map
            });

            break;
        case 'down':
            chrome.storage.sync.set({
                preDown: map
            });
            break;
        case 'right':
            chrome.storage.sync.set({
                preRight: map
            });
            break;
        case 'left':
            chrome.storage.sync.set({
                preLeft: map
            });
            break;
        case 'open-emojis':
            chrome.storage.sync.set({
                preOpenEmojis: map
            });
            break;
        case 'next':
            chrome.storage.sync.set({
                preNext: map
            });
            break;
        case 'previous':
            chrome.storage.sync.set({
                prePrevious: map
            });
            break;
    }
}

function restore_defaults(){
    chrome.storage.sync.set({
        openEmojis_sh: defaults.openEmojis,
        up_sh: defaults.up,
        down_sh: defaults.down,
        right_sh: defaults.right,
        left_sh: defaults.left,
        next_sh: defaults.next,
        previous_sh: defaults.previous,
        preOpenEmojis: defaults.openEmojis,
        preUp: defaults.up,
        preDown: defaults.down,
        preLeft: defaults.left,
        preRight: defaults.right,
        preNext: defaults.next,
        prePrevious: defaults.previous
        }, function () {
            // Update status to let user know options were restored.
            restore_options();
            removeEditedInputsClass();
            var status = document.getElementById('status-restore');
            $(status).fadeIn();
            setTimeout(function () {
                $(status).fadeOut();
            }, 2000);
        });
}

restore_options();


