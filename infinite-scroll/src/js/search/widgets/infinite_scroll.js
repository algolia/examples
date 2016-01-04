var instantsearch = require('instantsearch.js'),
    Mustache = require('mustache'),
    _ = require('lodash');

var cursor, index, page, nbPages, loading;

var hitsDiv = document.getElementById('hits');

var renderTemplate = function(template, res){
  var results = document.createElement('div');
  results.innerHTML = Mustache.render(template, res);
  return results;
};

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
  page = res.page;
  _.assign(res, {pageNo: page + 1});
  loading = false;

  var result = renderTemplate(this.templates.items, res);
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
  var results = renderTemplate(this.templates.items, res);
  this.container.appendChild(result);

  loading = false;
};

var initialRender = function(container, args, templates, parent){
  if(args.results.nbHits) {
    _.assign(args.results, {pageNo: page + 1});
    var results = renderTemplate(templates.items, args.results);
  } else {
    var results = renderTemplate(templates.empty, args.results);
    results.querySelector('.clear-all').addEventListener('click', function(e){
      e.preventDefault();
      helper.clearRefinements().setQuery('').search();
    });
  }

  container.innerHTML = '';
  container.appendChild(results);
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
      page = args.state.page;
      nbPages = args.results.nbPages;

      var scope = {
        templates: templates,
        container: container,
        args: args
      };

      if(args.results.nbHits) {
        hitsDiv.addEventListener('scroll', searchNewRecords.bind(scope));
      }

      initialRender(container, args, templates);
    }
  }
};

module.exports  = instantsearch.widgets.infiniteScrollWidget = infiniteScrollWidget;
