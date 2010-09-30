for( var i = 0; i < document.links.length; i++ ) {
    document.links[i].addEventListener("contextmenu", function(event) {
        chrome.extension.sendRequest({
            "text": this.text
        });
    }, false );
}

