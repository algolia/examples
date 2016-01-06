/* global $, algoliasearch, _googCsa */

/*eslint-disable */
// Importing Google AdSense library
(function(G,o,O,g,L,e){G[g]=G[g]||function(){(G[g]['q']=G[g]['q']||[]).push(
arguments)},G[g]['t']=1*new Date;L=o.createElement(O),e=o.getElementsByTagName(
O)[0];L.async=1;L.src='//www.google.com/adsense/search/async-ads.js';
e.parentNode.insertBefore(L,e)})(window,document,'script','_googCsa');
/*eslint-enable */

$(function () {
  // Dom binding
  var $searchInput = $('#search-input');
  var $resultContainer = $('#search-results-container');
  var $searchStatsContainer = $('#search-stats-container');

  var lastQuery = $searchInput.val() || '';

  // AdSense Configuration
  // ------------------------------
  var pageOptions = {
    pubId: 'pub-9616389000213823', // Enter your own pubId here!
    query: lastQuery
  };
  var adblock = {container: 'adcontainer', width: 900};

  // Algolia Configuration
  // ------------------------------
  var algoliaClient = algoliasearch('latency', '6be0576ff61c053d5f9a3225e2a90f76'); // Enter your Algolia credentials here
  var index = algoliaClient.initIndex('instant_search');

  // Initial search
  // ------------------------------
  // lastQuery && _googCsa('ads', pageOptions, adblock);
  // searchProducts(lastQuery);

  // User interaction binding
  // ------------------------------
  $searchInput.on('keyup change', function (event) {
    event.preventDefault();
    var $input = $(this);

    if ($input.val() !== lastQuery) {
      lastQuery = $input.val();

      // Refresh AdSense results
      pageOptions.query = lastQuery;
      if (lastQuery) {
        _googCsa('ads', pageOptions, adblock);
      }

      // Refresh Algolia results
      searchProducts(lastQuery);
    }
  });


  // Perform Algolia search and refresh UI
  // ------------------------------
  function searchProducts() {
    index.search(lastQuery, {hitsPerPage: 5})
    .then(function searchSuccess(content) {
      displayResults(content);
      displaySearchStats(content);
    })
    .catch(function searchFailure(err) {
      /* eslint-disable no-console */
      console.error(err);
      /* eslint-enable no-console */
    });
  }

  function displayResults(content) {
    var html = '';

    if (content.hits.length > 0) {
      for (var hit in content.hits) {
        if ({}.hasOwnProperty.call(content.hits, hit)) {
          html += '<p>' + content.hits[hit]._highlightResult.name.value + '</p>';
        }
      }
    } else {
      html = 'No results found';
    }

    $resultContainer.html(html);
  }

  function displaySearchStats(content) {
    var html = content.nbHits + ' products <small>founds in <strong>' + content.processingTimeMS / 1000 + ' seconds</strong>';
    $searchStatsContainer.html(html);
  }
});
