//alert("hello");
//document.body.style.background = 'yellow';
// register the handler
document.body.addEventListener('keydown', doc_keyDown);

function doc_keyDown(keys) {
    //keys.preventDefault();
    console.log(keys);
    if (keys.altKey && keys.keyCode == 69) {
        keys.preventDefault();
        openEmojiForCurrentConversation();
    } else if (keys.keyCode >= 37 &&  keys.keyCode <= 40){
        var focused = document.activeElement;
        if(focused.attributes.getNamedItem("aria-label") !== null
            && focused.attributes.getNamedItem("aria-label").textContent == "Choisir un emoji"){
            keys.preventDefault();
            selectEmojiWithKey(keys.keyCode, getEmojiTd(focused));
        }
    } else if(keys.keyCode == 32){ //spacebar
        var focused = document.activeElement;
        if(focused.attributes.getNamedItem("aria-label") !== null
            && focused.attributes.getNamedItem("aria-label").textContent == "Choisir un emoji"){
            keys.preventDefault();
            focused.click();
            focused.focus();
        }
    } else if(keys.keyCode == 13){ //enter
        var focused = document.activeElement;
        if(focused.attributes.getNamedItem("aria-label") !== null
            && focused.attributes.getNamedItem("aria-label").textContent == "Choisir un emoji"){
            keys.preventDefault();
            openEmojiForCurrentConversation();
        }
    }
}

function openEmojiForCurrentConversation(){

    var focused = document.activeElement;
    //console.log(focused);
    var focusedConversation = getFocusedConversationListener(focused);
    if (focusedConversation !== null) {
        clickOnEmojisRef(focusedConversation);
    }
}

function getFocusedConversationListener(focused){

    var conversations = document.body.getElementsByClassName("fbNubFlyout");
    var focusedConversation = null;

    for(var i = 0; i < conversations.length; i++){
        var conversation = conversations.item(i);
        if (conversation.contains(focused)) {
            focusedConversation = conversation;
            return focusedConversation;
        }
    }
    return focusedConversation;
}

function clickOnEmojisRef(focusedConversation){
    var emoji_href = focusedConversation.querySelector('[title="Choisir un emoji"]');
    if (emoji_href !== null){
        var emojisNotAlreadyOpen = document.body.querySelector('[data-tooltip-content="Envoyés récemment"]') === null;
        emoji_href.click();
        if(emojisNotAlreadyOpen){
            clickOnRecentEmojis();
        }
    }
}

function clickOnRecentEmojis(){
    var recentEmojis = null;

    var i = 0, howManyTimes = 50;
    function f() {
        recentEmojis = document.body.querySelector('[data-tooltip-content="Envoyés récemment"]');
        i++;
        if( i < howManyTimes && recentEmojis === null){
            setTimeout( f, 50 );
        } else if(recentEmojis !== null){
            recentEmojis = recentEmojis.firstElementChild;
            recentEmojis.click();
            selectFirstEmojiTd();
        }
    }
    f();
}

function selectFirstEmojiTd(){

    var x = 0, howManyTimes = 2;
    function f() {

        x++;
        if( x < howManyTimes ){
            setTimeout( f, 50 );
        } else {
            var emojiNode = document.body.querySelector('[aria-label="Choisir un emoji"]');
            emojiNode.focus();
            var td = emojiNode;

            var i = 1;
            do {
                td = td.parentNode;
                i++;
            } while(td.tagName != "TD");
        }
    }
    f();
}

function getEmojiTd(emojiFocused){
    do {
        emojiFocused = emojiFocused.parentNode;
    } while(emojiFocused.tagName != "TD");
    return emojiFocused;
}

function getEmojiTr(emojiFocused){
    do {
        emojiFocused = emojiFocused.parentNode;
    } while(emojiFocused.tagName != "TR");
    return emojiFocused;
}

function selectEmojiWithKey(keyCode, emojiFocusedTd){
    switch(keyCode){
        case 37: // Q
            console.log("wtf?");
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

function getPreviousEmoji(emojiFocusedTd){
    var previousEmoji = emojiFocusedTd.previousElementSibling;
    console.log(previousEmoji);
    if(previousEmoji !== null) previousEmoji.querySelector('[aria-label="Choisir un emoji"]').focus();
    return previousEmoji;
}

function getNextEmoji(emojiFocusedTd){
    var nextEmoji = emojiFocusedTd.nextElementSibling;
    if(nextEmoji !== null) nextEmoji.querySelector('[aria-label="Choisir un emoji"]').focus();
    return nextEmoji;
}
function getUpperEmoji(emojiFocusedTd){
    var emojisIndex = emojiFocusedTd.cellIndex;
    var currentTr = getEmojiTr(emojiFocusedTd);
    var previousTr = currentTr.previousElementSibling;
    if(previousTr !== null && previousTr.cells.length >= emojisIndex){
        var upperEmoji = previousTr.cells.item(emojisIndex);
        if(upperEmoji !== null) upperEmoji.querySelector('[aria-label="Choisir un emoji"]').focus();
        return upperEmoji;
    }
}

function getLowerEmoji(emojiFocusedTd){
    var emojisIndex = emojiFocusedTd.cellIndex;
    var currentTr = getEmojiTr(emojiFocusedTd);
    var nextTr = currentTr.nextElementSibling;
    if(nextTr !== null && nextTr.cells.length >= emojisIndex){
        var lowerEmoji = nextTr.cells.item(emojisIndex);
        if(lowerEmoji !== null) lowerEmoji.querySelector('[aria-label="Choisir un emoji"]').focus();
        return lowerEmoji;
    }
}