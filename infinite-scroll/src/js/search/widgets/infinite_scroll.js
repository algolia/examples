var instantsearch = require('instantsearch.js')
  , Mustache = require('mustache')
  , _ = require('lodash');

var infiniteScrollWidget = function(options) {
  var container = document.querySelector(options.container);
  var options = options;
  var templates = options.templates;

  if (!container) {
    throw new Error('infiniteScroll: cannot select \'' + options.container + '\'');
  }

  return {
    render: function(args) {
      var helper = args.helper;
      var page = args.state.page;
      var offset = args.state.offset;
      var parent = document.createElement('div');

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

      container.innerHTML = '';
      return container.appendChild(parent);
    }
  }
};

module.exports  = instantsearch.widgets.infiniteScrollWidget = infiniteScrollWidget;
