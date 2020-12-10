/*
 *   Copyright (c) 2020 TYONLINE TECHNOLOGY PTY. LTD. (TYO Lab) All rights reserved. 
 *   @author Eric Tang (twitter: @_e_tang).
 */

function toPath  ($node) {
    var parents:any[] = [];

    $node.parents().addBack().not('html').each(function() {

        // @ts-ignore
        var entry = this.tagName.toLowerCase();
        // @ts-ignore
        if (this.className) {
            // @ts-ignore
            entry += "." + this.className.replace(/ /g, '.');
            }
            parents.push(entry);
    });

    return parents.join(" ");
}

export default toPath;