function LinkData() {}
LinkData.prototype = {
    "linktext"  : "link text",
    "linkurl"   : "http://example.com/link-url",
    "linktitle" : "link title",
    "pageurl"   : "http://example.com/currentpage",
    "pagetitle" : "page title"
};

window.addEventListener( "load", function () {
    module( "Formatting" );
    test("Just the Text", function() {
        expect(2);
        var data;

        data = new LinkData();
        equals( format( data, "text" ), "link text", "Copied link text" );

        data = new LinkData();
        data.linktext = undefined;
        equals( format( data, "text" ), "", "No link text" );
    });

    test("As HTML Link", function() {
        expect(3);
        var data;

        data = new LinkData();
        equals( format( data, "html" ), '<a href="http://example.com/link-url">link text</a>', "HTML format" );

        data = new LinkData();
        data.linktext = undefined;
        equals( format( data, "html" ), '<a href="http://example.com/link-url"></a>', "HTML format (no link text)");

        data = new LinkData();
        data.linkurl = undefined;
        equals( format( data, "html" ), '<a href="">link text</a>', "HTML format (no link url)");
    });

    test("As MediaWiki Link", function() {
        expect(3);
        var data;

        data = new LinkData();
        equals( format( data, "mediawiki" ), '[http://example.com/link-url link text]', "MediaWiki format" );

        data = new LinkData();
        data.linktext = undefined;
        equals( format( data, "mediawiki" ), 'http://example.com/link-url', "MediaWiki format (no link text)" );

        data = new LinkData();
        data.linkurl = undefined;
        equals( format( data, "mediawiki" ), 'link text', "MediaWiki format (no link url)" );
    });

    test("Custom with Variables", function() {
        expect(8);
        var data;

        data = new LinkData();
        equals( format( data, "%%url%% %%text%% %%title%% %%pageurl%% %%pagetitle%%" ), "http://example.com/link-url link text link title http://example.com/currentpage page title", "All variables" );
        equals( format( data,
            "1. url:[%%url%%] 2. text:[%%text%%] 3. title:[%%title%%] 4. pageurl:[%%pageurl%%] 5. pagetitle:[%%pagetitle%%]"),
            "1. url:[http://example.com/link-url] 2. text:[link text] 3. title:[link title] 4. pageurl:[http://example.com/currentpage] 5. pagetitle:[page title]",
        "Mixed variables and constants");
        equals( format( data, "always constant" ), "always constant", "All constants" );
        equals( format( data,
            "%url% %%url %%url% %% url %% %%url%%url%% %%url%%%%url%%"), 
            "%url% %%url %%url% %% url %% http://example.com/link-urlurl%% http://example.com/link-urlhttp://example.com/link-url",
        "Malformed and multiple variables" );


        data = {
            linktext    : undefined,
            linkurl     : undefined,
            linktitle   : undefined,
            pageurl     : undefined,
            pagetitle   : undefined
        }
        equals( format( data, "%%url%% %%text%% %%title%% %%pageurl%% %%pagetitle%%" ), "    ", "All variables" );
        equals( format( data,
            "1. url:[%%url%%] 2. text:[%%text%%] 3. title:[%%title%%] 4. pageurl:[%%pageurl%%] 5. pagetitle:[%%pagetitle%%]" ), 
            "1. url:[] 2. text:[] 3. title:[] 4. pageurl:[] 5. pagetitle:[]", "Mixed variables and constants");
        equals( format( data, "always constant" ), "always constant", "All constants" );
        equals( format( data,
            "%url% %%url %%url% %% url %% %%url%%url%% %%url%%%%url%%"),
            "%url% %%url %%url% %% url %% url%% ",
        "Malformed and multiple variables" );
    });

    module("Page interaction");
    test("Data extracted from a link", function() {
        expect(8);
        var data;

        var linkelement = document.createElement("a");
        linkelement.href = "/somelink";
        linkelement.textContent = "Some Random Link";
        linkelement.title = "Some Title";

        data = extractLinkData(linkelement, document);
        equals(data.linktext, "Some Random Link", "Link text");
        equals(data.linkurl, chrome.extension.getURL("/somelink"), "Link url");
        equals(data.linktitle, "Some Title", "Link title" );
        equals(data.pageurl, chrome.extension.getURL("/tests/tests.html"), "Page url");
        equals(data.pagetitle, "Tests", "Page title");

        var linkelement = document.createElement("a");

        data = extractLinkData(linkelement, document);
        equals(data.linktext, "", "No link text");
        equals(data.linkurl, "", "No link url");
        equals(data.linktitle, "", "No link title" );
    })
}, true);
