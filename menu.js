document.body.addEventListener("contextmenu", function(event) {
    var ele = event.srcElement;

    if ( ele.tagName == "A" ) {
        chrome.extension.sendRequest({
            "text": ele.text
        });
    }
}, true );

