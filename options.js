function reInitContextMenus() {
    chrome.contextMenus.removeAll(
        initContextMenus
    );
}

function initContextMenus() {
    var formats = JSON.parse(localStorage["outputformats"]);
    for(var formatType in formats["enabled"]) {
        if ( ! formats["enabled"][formatType] )
            continue;

        var builtin = (formatType == "text" || formatType == "mediawiki" || formatType == "html" );
        var outputformat = builtin ? formatType : formats["custom"][formatType + "_text"];

        if ( ! outputformat )
            continue;

        var title = builtin
            ? chrome.i18n.getMessage("contextMenu_command_menu_"+formatType)
            : formats["custom"][formatType+"_text"];

        chrome.contextMenus.create({
            "type": "normal",
            "title": title,
            "contexts": ["link"],
            "onclick": (function(output) {
                return function( link, tab ) {
                    var textarea = document.getElementById("tmp-clipboard");

                    var text = format( JSON.parse(sessionStorage["clicked"]), output );
                    if ( text ) {
                        textarea.value = text;

                        textarea.select();
                        document.execCommand("copy", false, null);
                    }
                };
            })(outputformat)
          });
    }
}
