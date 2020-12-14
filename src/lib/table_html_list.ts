/**
 * @file table_html_table.js
 * 
 * Making a table with html table tag
 */

import Table from './table';

class TableHtmlList extends Table {
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
    return `<div class="${styleStr} col-${index}">${cellData}</div>`;
}

makeRowDiv (cols, joined_by) {
    return `<li class="${this.classRow}" style="${this.styleRow}">`
                                 + cols.join(joined_by ||' \n') +
                                `</li>`;
}

makeHeaderDiv (headers, joined_by) {
    return `<li class="${this.classTableHeader}">` + 
    headers.join(joined_by || " \n") +
`</li>`;
}

makeCellDividerDiv () {
    return `<div class="${this.classCellDivider}"></div>`;
}

makeHeaderCellDiv (index, headerCol) {
    return (`<div class="${this.classHeaderCell} col-${index}">${headerCol}</div>`);
}

makeTableDiv (rows, joined_by) {
    return  (
        `<ul class="${this.classTable}">`
            +
            rows.join(joined_by ||' \n')
            +
        `</ul>`
    );
}
}

export default TableHtmlList;