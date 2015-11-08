$(document).ready(function() {



  // INITIALIZATION
  // ==============
  var APPLICATION_ID = '65YSYSNYHU';
  var SEARCH_ONLY_API_KEY = '0d356ed6cdf6bc50c6289fa51d48d77d';

  // Client
  var algolia = algoliasearch(APPLICATION_ID, SEARCH_ONLY_API_KEY);

  // DOM and Templates binding
  var $searchInput = $("#input-tags input");
  $searchInputIcon = $('#search-input-icon');
  var $keywords = $('#keywords');
  var $hits = $('#hits');
  var keywordsTemplate = Hogan.compile($('#keywords-template').text());
  var hitsTemplate = Hogan.compile($('#hits-template').text());

  // Selectize
  var selectizeKeywords = "";
  var $selectize =  $searchInput.selectize({
    plugins: ['restore_on_backspace', 'remove_button'],
    choices: null,
    delimiter: ',',
    persist: false,
    create: true,
    onBlur: function() {
      toggleIconEmptyInput();
    },
    onChange: function(value) {
      selectizeKeywords = value;
      search();
    }
  })[0].selectize;

  // Initial search
  search();



  // SEARCH ALL
  // ==========
  $selectize.$control_input.on('keyup', function() {
    toggleIconEmptyInput();
    search();
  });
  function search() {
    var query = $selectize.$control_input.val();
    var tags = selectizeKeywords;

    var queries = [
    { indexName: 'dribbble_tags', query: query, params: { hitsPerPage: query.length === 0 ? 0 : 5 } },
    { indexName: 'dribbble', query: query + " " + tags, params: { hitsPerPage: 0, maxValuesPerFacet: 30, facets: ['tags'], optionalWords: tags, minProximity: 8, restrictSearchableAttributes: ['tags'] } },
    { indexName: 'dribbble', query: tags, params: { hitsPerPage: 60, optionalWords: tags, minProximity: 8 } }
    ];
    algolia.search(queries, searchCallback);
  }



  // RENDER KEYWORDS + RESULTS
  // =========================
  function searchCallback(err, content) {
    renderKeywords(content.results[0].hits, content.results[1].facets.tags || []);
    renderHits(content.results[2]);
  }

  function renderKeywords(hits, facets) {
    var uniqueTags = selectizeKeywords.split(',');
    values = [];
    // Hits of dribbble_tags index
    for (var i = 0; i < hits.length; ++i) {
      var hit = hits[i];
      if ($.inArray(hit.name, uniqueTags) === -1) {
        values.push({ name: hit.name, cssClass: "hit-tag" });
        uniqueTags.push(hit.name);
      }
    }
    // Facets of dribbble index
    var tags = Object.keys(facets);
    for (i = 0; i < tags.length; ++i) {
      var tag = tags[i];
      if ($.inArray(tag, uniqueTags) === -1) {
        values.push({ name: tag, cssClass: "facet-tag" });
        uniqueTags.push(tag);
      }
    }
    $keywords.html(keywordsTemplate.render({ values: values.slice(0, 20) }));
  }

  function renderHits(content) {
    $hits.html(hitsTemplate.render(content));
  }



  // EVENTS BINDING
  // ==============
  $(document).on('click', '.add-tag', function(e) {
    e.preventDefault();
    $selectize.createItem($(this).data('value'), function(){});
    search();
  });
  $searchInputIcon.on('click', function(e) {
    e.preventDefault();
    $selectize.clear(false);
    $searchInput.val('').keyup().focus();
  });



  // HELPER METHODS
  // ==============
  function toggleIconEmptyInput() {
    var query = $selectize.$control_input.val() + selectizeKeywords;
    $searchInputIcon.toggleClass('empty', query.trim() !== '');
  }




});
