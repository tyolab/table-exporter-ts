/*
 *   Copyright (c) 2020 TYONLINE TECHNOLOGY PTY. LTD. (TYO Lab) All rights reserved. 
 *   @author Eric Tang (twitter: @_e_tang).
 */
/**
 * @file table.js
 */

//------------------------------------------------------------
// Helper Functions 
//------------------------------------------------------------
// Format the output so it has the appropriate delimiters
function isWindows() {
    // @ts-ignore
    return typeof navigator !== 'undefined' && navigator && navigator.platform && navigator.platform.indexOf('Win') > -1
}

const defaultRowDelim = isWindows() ? '\r\n' : '\n';

function formatRows(rows, colDelim?, rowDelim?) {
    colDelim = colDelim || ',';
    rowDelim = rowDelim || defaultRowDelim;

    return rows.get().join(rowDelim)
        .split(rowDelim).join(rowDelim)
        .split(colDelim).join(colDelim);
}

function formatHeader(rows, colDelim?) {
    colDelim = colDelim || ',';

    return rows.join(colDelim);
}

function newFormatRows(rows, colDelim?, rowDelim?) {
    colDelim = colDelim || ',';
    rowDelim = rowDelim || defaultRowDelim;

    return rows.join(rowDelim)
        .split(rowDelim).join(rowDelim)
        .split(colDelim).join(colDelim);
}

class Table {
    public classTable = "data-table";
    public classCellDivider:string | null = "data-table-cell-divider";
    public classHeaderCell = "data-table-header-cell";
    public classTableHeader = "data-table-header";
    public classCell = 'data-table-cell';
    public classRow = 'data-table-row';
    protected tmpColDelim: any;
    protected tmpRowDelim: any;

    public splitToColumnGroupSize: number = 0;
    public headers: any = null;

    public styleRow = '';

    // Rows
    public data_index = 0;

    constructor (inColDelim?: string, inRowDelim?: string) {

    // Temporary delimiter characters unlikely to be typed by keyboard
    // This is to avoid accidentally splitting the actual contents
    this.tmpColDelim = inColDelim || String.fromCharCode(11); // vertical tab character
    this.tmpRowDelim = inRowDelim || String.fromCharCode(0); // null character
};

 
//
createTableHeader(headerRow, groupsSize) {
    var headers:any[] = [];
    groupsSize = groupsSize || 1;
    for (var g = 0; g < groupsSize; ++g) {
        if (g > 0)
            headers.push(this.makeCellDividerDiv());   

        for (var i = 0; i < headerRow.length; i++) {
            headers.push(this.makeHeaderCellDiv(i, headerRow[i]));
        } 
    }

    return (
            this.makeHeaderDiv(headers));

}; 
 
makeCellDiv(index, cellData, styleStr?) {
    return `<div class="${styleStr}">${cellData}</div>`;
}

makeRowDiv(cols, joined_by?) {
    return `<div class="${this.classRow}" style="${this.styleRow}">`
                                 + cols.join(joined_by ||' \n') +
                                `</div>`;
}

makeHeaderDiv(headers, joined_by?) {
    return `<div class="${this.classTableHeader}">` + 
    headers.join(joined_by || " \n") +
`</div>`;
}

makeCellDividerDiv() {
    return `<div class="${this.classCellDivider}"></div>`;
}

makeHeaderCellDiv(index, headerCol) {
    return (`<div class="${this.classHeaderCell}">${headerCol}</div>`);
}

makeTableDiv(rows, joined_by?) {
    return  (
        `<div class="${this.classTable}">`
            +
            rows.join(joined_by ||' \n')
            +
        `</div>`
    );
}

/**
 * If you need to make an empty table with just headers
 * you need to pass on (headers, []) // 
 */
makeHtmlTable(headers, rows, joined_by?) {
    if (!rows && headers && headers.length) {
        rows = headers;
        headers = null;
    }

    var table_array:any[] = [];

    if (rows && rows.length) {
        var rowsSize = rows.length;
        var groupsSize = 1;
        if (this.splitToColumnGroupSize > 0 && rowsSize > this.splitToColumnGroupSize)
            groupsSize = Math.ceil(rowsSize / this.splitToColumnGroupSize);

        // Header
        if (headers) {
            var header = this.createTableHeader(headers, groupsSize);
            table_array.push(header);
        }

        // Rows
        for (var x = this.data_index; x < rowsSize;) {
            var cols:any[] = [];
            
            // can't remember the purpose of this style
            // const styleStr = this.classCell + ((x > 1 && (x % 2) === 0) ? '2' : '');

            for (var g = 0; g < groupsSize; g++) {
                if (g > 0)
                    cols.push(this.makeCellDividerDiv());  

                var dataRow = rows[x];

                var colsCount = (dataRow.length && dataRow.length > 0) ? dataRow.length : 0;

                for (var i = 0; i < colsCount; i++) {
                    cols.push(
                            this.makeCellDiv(i, dataRow[i])
                        );     
                }

                ++x;
                if (x >= rowsSize)
                    break;
            }

            if (cols.length > 0)
                table_array.push(this.makeRowDiv(cols));
            cols = [];
        }
    }

    return this.makeTableDiv(table_array);
}

prepareTable() {

}

/**
 */
makeHtmlTables (tableObj, headerInRowIndex) {
    this.prepareTable();

    headerInRowIndex = headerInRowIndex || -1;

    var tables:any[] = [];

    for (var sheetName in tableObj) {
        var data = tableObj[sheetName];

        // Column Groups
        if (!data || !data.length)
            continue;

        // Header
        var headers = null;
        if (this.headers || headerInRowIndex > -1) {
            headers = this.headers || data[0];
        }
        
        var table = this.makeHtmlTable(headers, data);
        tables.push(table);
    }
    return tables;
}


generate_csv (table, cellDelim, rowDelim) {

    // Grab text from table into CSV formatted string
    var csv = '';
    if (table.headers) {
        csv += formatHeader(table.headers, cellDelim);
        csv += (rowDelim || defaultRowDelim);
    }
    if (table.rows && table.rows.length)
        csv += newFormatRows(table.rows, cellDelim, rowDelim);

    return csv;
}   

// exportTableToCSV($table) {
//     var $headers = $table.find('tr:has(th)')
//         ,$rows = $table.find('tr:has(td)')


//     // Grab text from table into CSV formatted string
//     var csv = '"';
//     csv += formatRows($headers.map(grabRow));
//     csv += rowDelim;
//     csv += formatRows($rows.map(grabRow)) + '"';
    
//     return csv;
// }
}

export default Table;