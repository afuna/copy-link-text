function extractLinkData (linkNode, page) {
    return {
        "linktext"  : linkNode.innerText,
        "linkurl"   : linkNode.href,
        "linktitle" : linkNode.title,
        "pageurl"   : page.location ? page.location.href : undefined,
        "pagetitle" : page.title
    }
}

var copiedClass = "copy-link-text-copied";
var copiedClassRegex = new RegExp("\\b"+copiedClass+"\\b", "g");;


// listener is on the document so that we also handle links added after page load
document.addEventListener( "contextmenu", function(event) {
    var node = event.target;

    // handle nested tags within the link
    // let's try and not hang the browser for a really complex dom tree 
    // -- hopefully we don't have stuff THIS nested
    var limit = 5;
    while ( node && ( limit-- > 0 ) ) {
        if ( node.nodeName === "A" && node.href != undefined ) {
            chrome.extension.sendRequest(extractLinkData(node, document), function(msg){

                var oldCopied = document.getElementsByClassName(copiedClass)
                for ( var i = 0; i < oldCopied.length; i++ ) {
                    oldCopied[i].className
                        = oldCopied[i].className.replace( copiedClassRegex, "" );
                }

                if(msg && msg.action == "copied"){
                    node.className += " " + copiedClass;
                }
            });
            return true;
        } else {
            node = node.parentNode;
        }
    }
}, false );
