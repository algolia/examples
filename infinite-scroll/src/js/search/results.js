var instantsearch = require('instantsearch.js')
  , getTemplate = require('../util/get_template.js')
  , header = require('../util/header.js');

module.exports = function(opts) {
  var search = instantsearch({
    appId: opts.appId,
    apiKey: opts.apiKey,
    indexName: opts.indexName,
    urlSync: {
      useHash: true
    }
  });

  var widgets = [
    instantsearch.widgets.searchBox({
      container: '#search-input'
    }),
    instantsearch.widgets.hits({
      container: '#hits',
      hitsPerPage: 10,
      templates: {
        item: getTemplate('hit'),
        empty: getTemplate('no-results')
      }
    }),
    instantsearch.widgets.stats({
      container: '#stats'
    }),
    instantsearch.widgets.sortBySelector({
      container: '#sort-by',
      autoHideContainer: true,
      indices: [{
        name: opts.indexName, label: 'Most relevant'
      }, {
        name: opts.indexName + '_price_asc', label: 'Lowest price'
      }, {
        name: opts.indexName + '_price_desc', label: 'Highest price'
      }]
    }),
    instantsearch.widgets.refinementList({
      container: '#category',
      attributeName: 'categories',
      limit: 10,
      operator: 'or',
      templates: {
        header: header('Category')
      }
    }),
    instantsearch.widgets.refinementList({
      container: '#brand',
      attributeName: 'brand',
      limit: 10,
      operator: 'or',
      templates: {
        header: header('Brand')
      }
    }),
    instantsearch.widgets.rangeSlider({
      container: '#price',
      attributeName: 'price',
      templates: {
        header: header('Price')
      }
    }),
    instantsearch.widgets.menu({
      container: '#type',
      attributeName: 'type',
      limit: 10,
      templates: {
        header: header('Type')
      }
    })
  ];

  widgets.forEach(search.addWidget, search);
  search.start();
}
