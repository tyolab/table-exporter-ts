module.exports = function (html, tableSelector, findSelector, callback) {
    var request = require('request');
    var cheerio = require('cheerio');

    var TableExporter = require('./lib/exporter');

    tableSelector = tableSelector | 'table';

    findSelector = findSelector || 'a';
    
    var links = [];
    var tables = [];

    callback = callback || function (x, y, k, nodes, $) {
        if (nodes.length > 0) {
            var colStr = '' + y;

            if (!links[k]) {
                links[k] = {};
            }

            if (!links[k][colStr]) {
                links[k][colStr] = [];
            }

            // var link = {table: k, row: x, col: y};
            var urls = [];
            $(nodes).each(function (i, link) {
                var url = $(link).attr('href');
                var anchor = $(link).text();
                urls.push({url: url, anchor: anchor});
            });
            // link.urls = urls;
            // links[k](link);
            links[k][colStr][x] = urls;
        }
    };

    function processHtml(html) {
        var $ = cheerio.load(html);

        var exporter = new TableExporter($);

        //var data = exporter.exportTableToCSV(/* selector to export */'table');

        var i = 0;
        $('table').each(function() {
            var table = exporter.export($(this), i, findSelector, callback);
            tables.push(table);
            ++i;
        });

        return {tables: tables, links: links};
    }

    return processHtml(html);
}