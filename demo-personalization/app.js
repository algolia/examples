/* global instantsearch */

app({
  appId: 'latency',
  apiKey: '6be0576ff61c053d5f9a3225e2a90f76',
  indexName: 'personalization_movies'
});

var user_bonus = [];
var actors_bonus = [];
var genres_bonus = [];

function app(opts) {
  var search = instantsearch({
    appId: opts.appId,
    apiKey: opts.apiKey,
    indexName: opts.indexName,
    urlSync: true,
    searchParameters: {
      optionalFacetFilters: ""
    }
  });

  search.addWidget(
    instantsearch.widgets.searchBox({
      container: '#search-input',
      placeholder: 'Search for movies'
    })
  );

  search.addWidget(
    instantsearch.widgets.hits({
      container: '#hits',
      hitsPerPage: 36,
      templates: {
        item: getTemplate('hit'),
        empty: getTemplate('no-results')
      },
      transformData: function(hit) {

        // Check if hit is in this user's watch list
        hit.in_watch_list = false;
        if (user_bonus && $.inArray(user_bonus, hit.watch_list) !== -1) {
          hit.in_watch_list = true;
        }
        // Display actors used as optionalFilters
        hit.actors_bonus = [];
        if (hit.actors) {
          for (var i = 0; i < hit.actors.length; ++i) {
            actor = hit.actors[i];
            if ($.inArray(actor, actors_bonus) !== -1) {
              hit.actors_bonus.push(actor);
            }
          }
        }
        // Display genres used as optionalFilters
        hit.genres_bonus = [];
        if (hit.genre) {
          for (var i = 0; i < hit.genre.length; ++i) {
            genre = hit.genre[i];
            if ($.inArray(genre, genres_bonus) !== -1) {
              hit.genres_bonus.push(genre);
            }
          }
        }
        // Display only matching actors' names
        if (hit._highlightResult && hit._highlightResult.actors) {
          var actors = []
          for (var i = 0; i < hit._highlightResult.actors.length; ++i) {
            actor = hit._highlightResult.actors[i];
            if (actor.matchLevel !== "none") {
              actors.push(actor);
            }
          }
          hit._highlightResult.actors = actors;
        }

        return hit;
      }
    })
  );
  search.addWidget({
    init: function(params) {
      $(document).on('click', '.perso-scenarii', function(e) {
        e.preventDefault();
        $('.perso-scenarii').removeClass("active");
        $(this).addClass("active");
        user_bonus = $(this).data("user");
        actors_bonus = $(this).data("actors") ? $(this).data("actors").split(",") : [];
        genres_bonus = $(this).data("genres") ? $(this).data("genres").split(",") : [];
        params.helper.setQueryParameter('optionalFacetFilters', optionalFiltersToAlgoliaParam()).search();
      });
    }
  });

  search.start();
}

function getTemplate(templateName) {
  return document.querySelector('#' + templateName + '-template').innerHTML;
}

function optionalFiltersToAlgoliaParam() {
  optionalFilters = []
  if (user_bonus) {
    optionalFilters.push("watch_list:" + user_bonus + "<score=2>");
  }
  for (var i = 0; i < actors_bonus.length; ++i) {
    optionalFilters.push("actors: " + actors_bonus[i]);
  }
  for (var i = 0; i < genres_bonus.length; ++i) {
    optionalFilters.push("genre: " + genres_bonus[i]);
  }
  return optionalFilters.join(", ");
}