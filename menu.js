document.addEventListener( "contextmenu", function(event) {
    var node = event.target;
    var limit = 5; // Try and not hang the browser for a really complex dom tree -- hopefully we don't have stuff THIS nested
    while ( node && ( limit-- ) > 0 ) {
        if ( node.nodeName === "A" && node.href != undefined ) {
            chrome.extension.sendRequest({
                "text": node.innerText
            });
            return true;
        } else {
            node = node.parentNode;
        }
    }
}, false );
