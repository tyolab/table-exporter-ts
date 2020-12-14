/**
 * @file table_html_css.js
 * 
 * Making a table with css
 */

import Table from './table';

class TableHtmlTable extends Table {

    constructor(inColDelim?: string, inRowDelim?: string) {
        super(inColDelim, inRowDelim);

    this.classCellDivider = null; 
    this.classTable = '';
    this.classCellDivider = '';
    this.classHeaderCell = '';
    this.classTableHeader = '';
    this.classCell = '';
    this.classRow = '';        
}


makeCellDiv (index, cellData, styleStr) {
    return `<td class="${styleStr || ''} col-${index}">${cellData}</td>`;
}

makeRowDiv (cols, joined_by) {
    return `<tr class="${this.classRow}" style="${this.styleRow}">`
                                 + cols.join(joined_by ||' \n') +
                                `</tr>`;
}

makeHeaderDiv (headers, joined_by) {
    return `<tr class="${this.classTableHeader}">` + 
    headers.join(joined_by || " \n") +
`</tr>`;
}

makeCellDividerDiv () {
    if (this.classCellDivider)
        return `<div class="${this.classCellDivider}"></div>`;
    return '';
}

makeHeaderCellDiv (index, headerCol) {
    return (`<th class="${this.classHeaderCell} col-${index}">${headerCol}</th>`);
}

makeTableDiv (rows, joined_by) {
    return  (
        `<table class="${this.classTable}">`
            +
            rows.join(joined_by ||' \n')
            +
        `</table>`
    );
}
}

export default TableHtmlTable;
