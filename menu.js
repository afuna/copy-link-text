// listener is on the document so that we also handle links added after page load
document.addEventListener( "contextmenu", function(event) {
    var node = event.target;

    // handle nested tags within the link
    // let's try and not hang the browser for a really complex dom tree 
    // -- hopefully we don't have stuff THIS nested
    var limit = 5;
    while ( node && ( limit-- > 0 ) ) {
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
