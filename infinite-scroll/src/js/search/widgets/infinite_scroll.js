var instantsearch = require('instantsearch.js'),
    Mustache = require('mustache'),
    _ = require('lodash');

var cursor, index, page, nbPages, hitsDiv;

var scrolledNearBottom = function(el){
  return (el.scrollHeight - el.scrollTop) < 850;
}

var infiniteScrollWidget = function(options) {
  var container = document.querySelector(options.container);
  var options = options;
  var templates = options.templates;
  var loading = false;

  if (!container) {
    throw new Error('infiniteScroll: cannot select \'' + options.container + '\'');
  }

  return {
    init: function(){
      page = undefined;
      nbPages = undefined;
      hitsDiv = document.getElementById('hits');
    },

    render: function(args) {
      var helper = args.helper;
      var parent = document.createElement('div');

      page = args.state.page;
      nbPages = args.results.nbPages;

      var addNewRecords = function(){
        if( scrolledNearBottom(hitsDiv) ) {
          if(!loading && page < nbPages - 1) {
            loading = true;
            page += 1;
            helper.searchOnce({page: page}, function(err, res, state){
              page = res.page;
              _.assign(res, {pageNo: page + 1});
              loading = false;
              result = document.createElement('div');
              result.innerHTML = Mustache.render(templates.items, res);
              container.appendChild(result);

              if(page === nbPages - 1 && (args.results.nbHits > nbPages * args.results.hitsPerPage)){
                index = helper.client.initIndex(args.state.index);
                hitsDiv.removeEventListener('scroll', addNewRecords);
                hitsDiv.addEventListener('scroll', browseNewRecords);
                addBrowsedRecords();
              }
            });
          }
        }
      };

      var browseNewRecords = function(){
        if( scrolledNearBottom(hitsDiv) ) {
          if(!loading) {
            addBrowsedRecords();
          }
        }
      }

      var addBrowsedRecords = function(){
        loading = true;
        if(!cursor) {
          index.browse(args.state.query, {page: 0, hitsPerPage: 20}, function(err, res){
            cursor = res.cursor;

            result = document.createElement('div');
            result.innerHTML = Mustache.render(templates.items, res);
            container.appendChild(result);

            loading = false;
          });
        } else {
          index.browseFrom(cursor, function(err, res){
            cursor = res.cursor;

            result = document.createElement('div');
            result.innerHTML = Mustache.render(templates.items, res);
            container.appendChild(result);

            loading = false;
          });
        }
      }

      if(args.results.nbHits) {
        _.assign(args.results, {pageNo: page + 1});
        parent.innerHTML = Mustache.render(templates.items, args.results);
      } else {
        parent.innerHTML = Mustache.render(templates.empty, args.results);
        parent.querySelector('.clear-all').addEventListener('click', function(e){
          e.preventDefault();
          helper.clearRefinements().setQuery('').search();
        });
      }

      hitsDiv.addEventListener('scroll', addNewRecords);

      container.innerHTML = '';
      container.appendChild(parent);

      if(window.innerHeight > document.body.clientHeight) {
        addNewRecords();
      }
    }
  }
};

module.exports  = instantsearch.widgets.infiniteScrollWidget = infiniteScrollWidget;
