
import { TableExporter } from './lib';

function isInBrowser() {
    //@ts-ignore
    try {return this===window;}catch(e){ return false;}
}
class Exporter {
    public $: any;
    public in_browser: boolean;
    public environment: string | null;
    public table_exporter: any;

    constructor() {
        this.$ = null;     
        this.in_browser = false;
        this.environment = null;   
    }

    initialize(is_in_browser) {
        this.in_browser = is_in_browser;
        this.environment = (this.in_browser ? "browser" : "node"); 
    }

    export (html, tableSelector, selectors, findProcessor) {

        this.$ = this.getQuery(html);
    
        return this.exportNode(this.$, tableSelector, selectors, findProcessor);
    }
    
    /**
     *  sometimes it is easier to export rows rather than a single element
     */
    
    exportRows (html, selector, findProcessor) {
    
            findProcessor = findProcessor || this.linkProcessor.bind(this);
    
            var $ = this.getQuery(html);
    
            var exporter = new TableExporter($);
            var i = 0;
    
            var rows = exporter.exportRows($(this), selector, findProcessor);
    
            return rows;
        }
    
    getQuery (selector, parent?:any) {
        if (this.in_browser) {
            if (typeof this.$ === 'undefined') {
                // @ts-ignore
                var se = document.createElement('script'); 
                se.type = 'text/javascript'; 
                se.async = true;
                // @ts-ignore
                se.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js';
                // @ts-ignore
                var s = document.getElementsByTagName('script')[0]; 
                s.parentNode.insertBefore(se, s);
            }
            // @ts-ignore
            this.$ = $;
            return this.$(selector || 'html', parent);
        }
        else {
            if (!this.$) {
                var cheerio = require('cheerio');
                this.$ = cheerio.load(selector);
                return this.$;
            }
            return this.$(selector, parent);
        }
    }
    
    /**
     * export table with a selector for a particular node
     */
    
    linkProcessor ($, nodes, x, y, k) {
        var urls:any[] = [];
        if (nodes.length > 0) {
            
            $(nodes).each(function (i, link) {
                var url = $(link).attr('href');
                var anchor = $(link).text();
                urls.push({url: url, anchor: anchor});
            });
        }
        return urls.length > 0 ? {urls: urls} : null;
    };
    
    /**
     * Export from parsed node by jQuery or Cheerio
     */
    
    exportNode (node, tableSelector, selectors, findProcessor) {
        var self = this;
    
        var result:any = {};
        var tables:any[] = [];
    
        function processNode($node) {
            var exporter = new TableExporter($node);
            var i = 0;
    
            var $tables;
            if (typeof node === 'object' && !tableSelector)
                // tableSelector should be set before calling this method
                $tables = node;
            else {
                    // if table selector is not set, we would just table
                tableSelector = tableSelector || "table";
                $tables = self.in_browser ? self.getQuery(tableSelector, $node) : $node(tableSelector);
            }
    
            $tables.each(function(index, table) {
                // @ts-ignore
                var $table = self.getQuery(table || this);
                var table:any = exporter.export($table, i, selectors, findProcessor);
                if (null != table)
                    tables.push(table);
                ++i;
            });
    
            result.tables = tables;
            result.exporter = exporter;
            return result;
        }
        return processNode(node);
    }    
}

export default Exporter;