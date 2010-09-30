document.addEventListener( "contextmenu", function(event) {
    if ( event.target.nodeName === "A" ) {
        chrome.extension.sendRequest({
            "text": event.target.innerText
        });
    }
}, false );
