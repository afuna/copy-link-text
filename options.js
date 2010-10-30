function reinit_context_menus() {
    chrome.contextMenus.removeAll(
        init_context_menus
    );
}

function init_context_menus() {
    var formats = get_saved_options();
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
                    var doc = chrome.extension.getBackgroundPage().document;
                    var textarea = doc.getElementById("tmp-clipboard");

                    var text = format( JSON.parse(localStorage["clicked"] || "{}"), output );
                    if ( text ) {
                        textarea.value = text;

                        textarea.select();
                        doc.execCommand("copy", false, null);
                    }
                    localStorage.removeItem("clicked");
                };
            })(outputformat)
          });
    }
}


function log(message) {
    document.getElementById("status").innerHTML = "<div class='message'>"+message+"</div>" + document.getElementById("status").innerHTML;
}

function save_options() {
    var options = { enabled: {}, custom: {} };

    var elements = document.getElementsByName("outputformat");
    for(var i = 0; i < elements.length; i++) {
        var ele = elements[i];
        if (ele.checked)
            options["enabled"][ele.id] = true;
    }

    elements = document.getElementsByName("custom");
    for(var i = 0; i < elements.length; i++) {
        var ele = elements[i];
        if(ele.value && ele.value != "")
            options["custom"][ele.id] = ele.value;
    }
    localStorage["outputformats"] = JSON.stringify(options);

    reinit_context_menus();

    log("Your options have been saved.");
}

function get_saved_options() {
    if ( localStorage["outputformats"] )
        return JSON.parse(localStorage["outputformats"]);
    else
        return { enabled: { text: true } }; 
}


function restore_options() {
    var options = get_saved_options();

    for(var id in options["enabled"])
        document.getElementById(id).checked = options["enabled"][id];

    for(var id in options["custom"])
        document.getElementById(id).value = options["custom"][id];
}

var warned = false;
function register_multiple_warning() {
    var elements = document.getElementsByName("outputformat");

    // if we started out with more than one element checked
    // then we don't need to warn anymore
    var checked = 0;
    for(var i = 0; i < elements.length; i++) {
        if (elements[i].checked)
            checked++;
    }
    if ( checked > 1 )
        return;
    
    for(var i = 0; i < elements.length; i++) {
        var input = elements[i];
        input.addEventListener("change", function(event) {
            if (warned)
                return;

            var checked = 0;
            for(var j = 0; j < elements.length; j++) {
                if (elements[j].checked)
                    checked++;
            }

            if ( checked > 1 ) {
                log("Note: Checking more than one format will create a second level of menus.");
                warned = 1;
            }
        }, false);
    }
}

function init() {
    restore_options();
    register_multiple_warning();
}
