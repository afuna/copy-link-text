function format( data, outformat ) {
    if ( ! outformat )
        outformat = "text";

    for(var i in data) {
        if (!data[i])
            data[i] = "";
    }

    switch(outformat) {
        case "text":
            return data.linktext;

        case "html":
            return '<a href="'+data.linkurl+'">'+data.linktext+'</a>';

        case "mediawiki":
            if (data.linkurl == "") {
                return data.linktext;
            } else if (data.linktext == "") {
                return data.linkurl;
            } else {
                return "["+data.linkurl + " " + data.linktext + "]";
            }
    }

    // fall through; we have a custom format
    var output = outformat;
    output = output.replace( /%%url%%/g, data.linkurl );
    output = output.replace( /%%text%%/g, data.linktext );
    output = output.replace( /%%title%%/g, data.linktitle );
    output = output.replace( /%%pageurl%%/g, data.pageurl );
    output = output.replace( /%%pagetitle%%/g, data.pagetitle );

    return output;
}
