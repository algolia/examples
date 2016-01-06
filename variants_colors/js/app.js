/* global $, Hogan, algoliasearch, algoliasearchHelper */

$(document).ready(function () {
  // INITIALIZATION
  // ==============

  // Replace with your own values
  var APPLICATION_ID = 'latency';
  var SEARCH_ONLY_API_KEY = '6be0576ff61c053d5f9a3225e2a90f76';
  var INDEX_NAME = 'variants_color';
  var PARAMS = {
    hitsPerPage: 20
  };

  // Client + Helper initialization
  var algolia = algoliasearch(APPLICATION_ID, SEARCH_ONLY_API_KEY);
  var algoliaHelper = algoliasearchHelper(algolia, INDEX_NAME, PARAMS);

  // DOM BINDING
  var $searchInput = $('#search-input');
  var $searchInputIcon = $('#search-input-icon');
  var $main = $('main');
  var $hits = $('#hits');

  // Hogan templates binding
  var hitTemplate = Hogan.compile($('#hit-template').text());
  var noResultsTemplate = Hogan.compile($('#no-results-template').text());

  // SEARCH BINDING
  // ==============

  // Input binding
  $searchInput
  .on('keyup', function () {
    $('#query-message').empty();
    var query = $(this).val();
    toggleIconEmptyInput(query);
    algoliaHelper.setQuery(query).search();
  })
  .focus();

  // Search errors
  algoliaHelper.on('error', function (error) {
    console.log(error);
  });

  // Search results
  algoliaHelper.on('result', function (content) {
    renderHits(content);
    handleNoResults(content);
  });

  // Initial search
  algoliaHelper.search();

  // RENDER SEARCH COMPONENTS
  // ========================

  function renderHits(content) {
    $hits.html(hitTemplate.render(content));
  }

  // NO RESULTS
  // ==========

  function handleNoResults(content) {
    if (content.nbHits > 0) {
      $main.removeClass('no-results');
      return;
    }
    $main.addClass('no-results');
    $hits.html(noResultsTemplate.render({query: content.query}));
  }

  // EVENTS BINDING
  // ==============

  $searchInputIcon.on('click', function (e) {
    e.preventDefault();
    $searchInput.val('').keyup().focus();
  });
  $(document).on('click', '.clear-all', function (e) {
    e.preventDefault();
    $searchInput.val('').focus();
    algoliaHelper.setQuery('').search();
  });
  $(document).on('click', '.set-distinct', function (e) {
    e.preventDefault();
    $('#query-message').empty();
    setDistinct($(this));
    algoliaHelper.search();
  });
  $(document).on('click', '.set-query', function (e) {
    e.preventDefault();
    $('#query-message').html($(this).data('message'));
    setDistinct($(".set-distinct[data-value='" + $(this).data('distinct') + "']"));
    setQuery($(this).data('query'));
    algoliaHelper.search();
  });

  // HELPER METHODS
  // ==============

  function setDistinct(selector) {
    $('.set-distinct').removeClass('active');
    selector.addClass('active');
    $('#distinct-message').html(selector.data('message'));
    algoliaHelper.setQueryParameter('distinct', selector.data('value'));
  }
  function setQuery(query) {
    toggleIconEmptyInput(query);
    $('#search-input').val(query);
    algoliaHelper.setQuery(query);
  }
  function toggleIconEmptyInput(query) {
    $searchInputIcon.toggleClass('empty', query.trim() !== '');
  }
});
