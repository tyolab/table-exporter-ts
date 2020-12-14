/**
 * Copyright (c) 2018-2020 TYONLINE TECHNOLOGY PTY. LTD. (TYO Lab) All rights reserved.
 * 
 * @author Eric Tang (twitter: @_e_tang)
 * 
 * Some code is from: https://bl.ocks.org/kalebdf/ee7a5e7f44416b2116c0
 * Authored by: Adila Faruk
 */

var defaultRowDelim = '\n';

var os:string = process.platform;
if (os == "darwin") {
} 
else if (os == "win32" || os == "win64") {
    defaultRowDelim = '\r\n';
} 
else if (os == "linux") {
}

export class TableExporter  {
    public $: any;
    private table: any;

    constructor($: any) {
        this.$ = $;

        this.table = null;
    }

    // Grab and format a row from the table
    grabRow(i, row){
            
        var $row = this.$(row);
        //for some reason $cols = $row.find('td') || $row.find('th') won't work...
        var $cols = $row.find('td'); 
        if(!$cols.length) $cols = $row.find('th');  

        return $cols.map(this.grabCol)
                    .get().join(defaultRowDelim);
    }

    // Grab and format a column from the table 
    grabCol(j,col){
        var $col = this.$(col),
            $text = $col.text();

        return $text.replace('"', '""'); // escape double quotes

    }

    //------------------------------------------------------------
    // Helper Functions for JavaScript objects
    //------------------------------------------------------------

    // Grab and format a row from the table
    toColumns(rowIndex, row, tableIndex, cellSelector, targetSelector, selectorProcessor) {

        var $row = this.$(row);
        //for some reason $cols = $row.find('td') || $row.find('th') won't work...
        var $cols = $row.find(cellSelector); 
        // if(!$cols.length) $cols = $row.find('th');  

        var colArray:any[] = [];

        $cols.each((colIndex, col) => {
            var $col = this.$(col),
                $text = $col.text().trim();

            var obj;

            if (targetSelector && selectorProcessor) {
                var $nodes = this.$(targetSelector, col);
                if ($nodes.length > 0) {
                    obj = selectorProcessor(this.$, $nodes, rowIndex, colIndex, tableIndex);                   
                }
            }

            if (obj) {
                obj.text = $text;
            }
            else {
                obj = $text;
            }

            colArray.push(obj);
        });
        return colArray; //[$cols.map(toColObj).get()];
    }

    // Grab and format a column from the table 
    toColumn(j, col){
        var $col = this.$(col),
            $text = $col.text().trim();

        return $text; // .replace('"', '""'); // escape double quotes not here, because it is text

    }


    /**
     * Table to JSON
     * 
     * 
     * 
     * [
     * {
     * "headers":['', '', ...],
     * "rows":[['', '', ...],
     * ...
     * ]
     * }
     * ],
     * ...
     * 
     * @param $table
     * @param k
     * @param options array for targetSelector, rowSelector, headerSelector, cellSelector
     * @param callback
     * 
     */

    export($table, tableIndex, options, callback) {
        let self = this;
        this.table = {};

        var targetSelector:string | null  = null, 
            rowSelector:string | null = null, 
            headerSelector:string | null  = null, 
            headerRowSelector:string | null  = null, 
            cellSelector:string | null  = null;
        var selectors;

        if (typeof options === "function") {
            callback = options;
            options = null;
        }

        if (null != options) {
            if (typeof options === 'object' && !Array.isArray(options)) {
                targetSelector = options["target-selector"] || null;
                cellSelector = options["cell-selector"] || null;
                headerSelector = options["header-selector"] || null;
                rowSelector = options["row-selector"] || null;
                headerRowSelector = options["header-row-selector"] || null;
            }
            else {
                if (Array.isArray(options))
                    selectors = options;
                else
                    selectors = [options];

                switch (selectors.length) {
                    case 5:
                        targetSelector = selectors[4];
                    case 4:
                        cellSelector = selectors[3];
                    case 3:
                        rowSelector = selectors[2];
                    case 2:
                        headerRowSelector = selectors[1];
                    case 2:
                        headerSelector = selectors[0];
                    case 0:
                        break;
                }
            }
        }

        var findHeaderSelector:string | null  = null;

        if (headerRowSelector === null) {
            if (headerSelector === 'th')
                findHeaderSelector = (rowSelector || 'tr') + ':has(th)'; // 'tr:has(th)'
            else {
                headerSelector = headerSelector || 'th';
                findHeaderSelector = (rowSelector || 'tr') + ':has(' + headerSelector + ')'; // can't use tr alone as header selector
            }
        }
        else {
            headerSelector = headerSelector || 'th';
            findHeaderSelector = headerRowSelector + ':has(' + headerSelector + ')';
        }
        // jquery function
        let $headerRow:any = null;
        if (findHeaderSelector) {
            $headerRow = $table.find(findHeaderSelector);
            if ($headerRow && $headerRow.length) {
                var $headers = $headerRow.find(headerSelector);
                
                var headersMap = $headers.map(function(index, header) {
                    return self.toColumn(index, header);
                });
                var headers = headersMap.get();
                if (headers.length > 0)
                    this.table.headers = headers;
            }
        }

        var findRowsSelector = (rowSelector || 'tr');
        if (cellSelector)
          findRowsSelector += ':has(' + cellSelector + ')'; 
        else if (findRowsSelector === 'tr')
            findRowsSelector += ':has(td)';

        var $rows = $table.find(findRowsSelector);

        if ($rows.length) {
            var rows = this.exportRows(tableIndex, $rows, cellSelector, targetSelector, callback);
            this.table.rows = rows;
        }
        
        return this.table;
    }

    /**
     * 
     */

    exportRows (tableIndex, $rows, cellSelector, targetSelector?, callback?) {
        var self = this;
        var rows:any[] = [];

        $rows.each(function(rowIndex, $row) {
            var ret:any = self.exportRow(tableIndex, rowIndex, $row, cellSelector, targetSelector, callback);
            rows.push(ret);
        });
        return rows;
    }

    /**
     * 
     */

    exportRow (tableIndex, rowIndex, row, cellSelector, targetSelector, cellProcessor) {
        var self = this;

        cellSelector = cellSelector || 'td';

        var $cols = self.$(row).find(cellSelector);

        var cols:any[] = [];

        $cols.each((colIndex, col) => {

            var obj;
            if (cellProcessor) {
                // There is something we need process accordingly because there might not just text interests you
                // if there is something returned, we push it into the column
                obj = cellProcessor(tableIndex, rowIndex, colIndex, self.$(col), cols);
            }          
            if (obj)
                cols.push(obj);
            else {
                var $text = self.toColumn(colIndex, col);
                cols.push($text);
            }
        });
        
        return cols;
    }
}
