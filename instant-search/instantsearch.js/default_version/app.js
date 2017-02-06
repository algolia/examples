/* global instantsearch */

app({
  appId: 'KHKP14DMQR',
  apiKey: '58f74646af37a47dcd4e8914e2382917',
  indexName: 'bestbuy'
});

function app(opts) {
  var search = instantsearch({
    appId: opts.appId,
    apiKey: opts.apiKey,
    indexName: opts.indexName,
    urlSync: true
  });

  search.addWidget(
    instantsearch.widgets.searchBox({
      container: '#search-input',
      placeholder: 'Search for products'
    })
  );

  search.addWidget(
    instantsearch.widgets.hits({
      container: '#hits',
      hitsPerPage: 10,
      templates: {
        item: getTemplate('hit'),
        empty: getTemplate('no-results')
      }
    })
  );

  search.addWidget(
    instantsearch.widgets.stats({
      container: '#stats'
    })
  );

  search.addWidget(
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
    })
  );

  search.addWidget(
    instantsearch.widgets.pagination({
      container: '#pagination',
      scrollTo: '#search-input'
    })
  );

  // search.addWidget(
  //   instantsearch.widgets.hierarchicalMenu({
  //     container: '#hierarchical-categories',
  //     attributes: ['hierarchicalCategories.lvl0', 'hierarchicalCategories.lvl1', 'hierarchicalCategories.lvl2'],
  //     sortBy: ['isRefined', 'count:desc', 'name:asc'],
  //     showParentLevel: false,
  //     limit: 10,
  //     templates: {
  //       header: getHeader('Category'),
  //       item:  '<a href="javascript:void(0);" class="facet-item {{#isRefined}}active{{/isRefined}}"><span class="facet-name"><i class="fa fa-angle-right"></i> {{name}}</span class="facet-name"><span class="ais-hierarchical-menu--count">{{count}}</span></a>'
  //     }
  //   })
  // );

  // search.addWidget(
  //   instantsearch.widgets.refinementList({
  //     container: '#brand',
  //     attributeName: 'brand',
  //     sortBy: ['isRefined', 'count:desc', 'name:asc'],
  //     limit: 10,
  //     operator: 'or',
  //     searchForFacetValues: {
  //       placeholder: 'Search for brands',
  //       templates: {
  //         noResults: '<div class="sffv_no-results">No matching brands.</div>'
  //       }
  //     },
  //     templates: {
  //       header: getHeader('Brand')
  //     }
  //   })
  // );

  search.addWidget(
    instantsearch.widgets.rangeSlider({
      container: '#price',
      attributeName: 'price',
      tooltips: {
        format: function(rawValue) {
          return '$' + Math.round(rawValue).toLocaleString();
        }
      },
      templates: {
        header: getHeader('Price')
      }
    })
  );

  search.addWidget(
    instantsearch.widgets.priceRanges({
      container: '#price-range',
      attributeName: 'price',
      labels: {
        currency: '$',
        separator: 'to',
        button: 'Go'
      },
      templates: {
        header: getHeader('Price range')
      }
    })
  );

  search.addWidget(
    instantsearch.widgets.menu({
      container: '#type',
      attributeName: 'type',
      sortBy: ['isRefined', 'count:desc', 'name:asc'],
      limit: 10,
      showMore: true,
      templates: {
        header: getHeader('Type')
      }
    })
  );

  search.start();
}

function getTemplate(templateName) {
  return document.querySelector('#' + templateName + '-template').innerHTML;
}

function getHeader(title) {
  return '<h5>' + title + '</h5>';
}
