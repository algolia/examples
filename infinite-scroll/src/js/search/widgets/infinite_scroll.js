var instantsearch = require('instantsearch.js')
  , Mustache = require('mustache')
  , _ = require('lodash');

var infiniteScrollWidget = function(options) {
  var container = document.querySelector(options.container);
  var options = options;
  var templates = options.templates;
  var loading = false;

  if (!container) {
    throw new Error('infiniteScroll: cannot select \'' + options.container + '\'');
  }

  return {
    render: function(args) {
      var helper = args.helper;
      var page = args.state.page;
      var nbPages = args.results.nbPages;
      var parent = document.createElement('div');

      var addNewRecords = function(){
        if( window.scrollY > (document.querySelector('body').clientHeight - window.innerHeight) - 300 ) {
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

              if(page === nbPages - 1){
                window.removeEventListener('scroll', addNewRecords);
              }
            });
          }
        }
      };

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

      if(window.innerHeight > document.body.clientHeight) { addNewRecords(); }

      window.addEventListener('scroll', addNewRecords);

      container.innerHTML = '';
      return container.appendChild(parent);
    }
  }
};

module.exports  = instantsearch.widgets.infiniteScrollWidget = infiniteScrollWidget;
