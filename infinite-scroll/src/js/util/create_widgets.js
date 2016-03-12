var instantsearch = require('instantsearch.js');
var header = require('./header.js');
var infiniteScrollWidget = require('../search/widgets/infinite_scroll.js');

module.exports = function (indexName) {
  return [
    instantsearch.widgets.searchBox({
      container: '#search-input'
    }),
    instantsearch.widgets.stats({
      container: '#stats'
    }),
    instantsearch.widgets.sortBySelector({
      container: '#sort-by',
      autoHideContainer: true,
      indices: [{
        name: indexName, label: 'Most relevant'
      }, {
        name: indexName + '_price_asc', label: 'Lowest price'
      }, {
        name: indexName + '_price_desc', label: 'Highest price'
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
    }),
    infiniteScrollWidget({
      container: '#hits',
      templates: {
        items: document.querySelector('#hits-template').innerHTML,
        empty: document.querySelector('#no-results-template').innerHTML
      },
      offset: 850
    })
  ];
};
