var instantsearch = require('instantsearch.js'),
    Mustache = require('mustache'),
    _ = require('lodash');

var cursor, index, page, nbPages, loading;

var hitsDiv = document.getElementById('hits');

var scrolledNearBottom = function(el){
  return (el.scrollHeight - el.scrollTop) < 850;
};

var searchNewRecords = function(){
  if(scrolledNearBottom(hitsDiv)) {
    addSearchedRecords.call(this);
  }
};

var browseNewRecords = function(){
  if(scrolledNearBottom(hitsDiv)) {
    addBrowsedRecords.call(this);
  }
};

var addSearchedRecords = function(){
  if(!loading && page < nbPages - 1) {
    loading = true;
    page += 1;
    helper.searchOnce({page: page}, appendSearchResults.bind(this));
  }
};

var appendSearchResults = function(err, res, state){
  var result = document.createElement('div');
  page = res.page;
  _.assign(res, {pageNo: page + 1});
  loading = false;

  result.innerHTML = Mustache.render(this.templates.items, res);
  this.container.appendChild(result);

  if(page === nbPages - 1 && (this.args.results.nbHits > nbPages * this.args.results.hitsPerPage)){
    index = helper.client.initIndex(this.args.state.index);
    hitsDiv.removeEventListener('scroll', searchNewRecords.bind(this));
    hitsDiv.addEventListener('scroll', browseNewRecords.bind(this));
    addBrowsedRecords.call(this);
  }
};

var addBrowsedRecords = function(){
  if(!loading) {
    loading = true;
    if(!cursor) {
      index.browse(this.args.state.query, {page: 0, hitsPerPage: 20}, appendBrowsedResults.bind(this));
    } else {
      index.browseFrom(cursor, appendBrowsedResults.bind(this));
    }
  }
};

var appendBrowsedResults = function(err, res){
  cursor = res.cursor;

  var result = document.createElement('div');
  result.innerHTML = Mustache.render(this.templates.items, res);
  this.container.appendChild(result);

  loading = false;
};

var infiniteScrollWidget = function(options) {
  var container = document.querySelector(options.container);
  var options = options;
  var templates = options.templates;

  if (!container) {
    throw new Error('infiniteScroll: cannot select \'' + options.container + '\'');
  }

  return {
    init: function(){
      page = undefined;
      nbPages = undefined;
      hitsDiv.removeEventListener(searchNewRecords);
      hitsDiv.removeEventListener(browseNewRecords);
    },

    render: function(args) {
      helper = args.helper;
      var parent = document.createElement('div');

      page = args.state.page;
      nbPages = args.results.nbPages;

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

      var scope = {
        templates: templates,
        container: container,
        args: args
      };

      hitsDiv.addEventListener('scroll', searchNewRecords.bind(scope));

      container.innerHTML = '';
      container.appendChild(parent);

      if(window.innerHeight > document.body.clientHeight) {
        searchNewRecords();
      }
    }
  }
};

module.exports  = instantsearch.widgets.infiniteScrollWidget = infiniteScrollWidget;
