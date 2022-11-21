
import { DataFrame } from 'data-forge';
import { readFileSync } from 'data-forge-fs';

import * as Params from 'node-programmer/params';

var params = new Params({
  "col": [], // the columns that need to be printed
  "col-len": [],
  "suffix": [],
  "prefix": [],
});

var opts = params.getOpts();
var optCount = params.getOptCount();

if (optCount < 1) {
    params.showUsage();
    process.exit(-1);
}

var input = opts['---'];

let df = readFileSync(input[0]).parseCSV();

let columns = df.getColumnNames();
let suffix_array = opts['suffix'];
let prefix_array = opts['prefix'];
let suffix = {};
let prefix = {};

for (let i = 0; i < suffix_array.length; i++) {
  let s = suffix_array[i].split(':');
  suffix[s[0]] = s[1];
}

for (let i = 0; i < prefix_array.length; i++) {
  let s = prefix_array[i].split(':');
  prefix[s[0]] = s[1];
}

if (opts.col.length > 0) {
  let array = df.toArray();
  let colNames: Set<string> = new Set();
  for (let i = 0; i < opts.col.length; i++) {
    let col = opts.col[i];
    let first = col[0];
    if (first >= '0' && first <= '9') 
      col = parseInt(col);

    let colName, colId;
    if (typeof col === 'number') {
      if (col < 1 || col > columns.length) {
        console.log(`Column index ${col} is out of range`);
        process.exit(-1);
      }
      colId = col - 1;
      colName = (columns[col - 1]);
    }
    else {
      if (!columns.includes(col)) {
        console.log(`Column ${col} does not exist`);
        process.exit(-1);
      }
      colName = (col);
      colId = columns.indexOf(col);
    }
    colNames.add(colName);
    // suffix[colName] = suffix_array[colId];
    // prefix[colName] = prefix_array[colId];
  }
  for (let row of array) {
    let str = '';
    let cols: string[] = Array.from(colNames);
    let col: string;
    for (let i = 0; i < cols.length; i++) {
      col = cols[i].trim();
      if (!col)
        continue;
      
      let len_i = opts['col-len'][i];
      if (len_i) {
        let len = parseInt(len_i);
        if (row[col].length != len)
          continue;
      }
      str += (prefix[col] ? prefix[col] : "") + row[col] + (suffix[col] ? suffix[col] : "") + '\t';
    }
    console.log(str);
  }
}



