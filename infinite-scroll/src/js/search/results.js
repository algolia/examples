var instantsearch = require('instantsearch.js')
  , createWidgets = require('../util/create_widgets.js');

module.exports = function(opts) {
  var search = instantsearch({
    appId: opts.appId,
    apiKey: opts.apiKey,
    indexName: opts.indexName,
    urlSync: {
      useHash: true
    }
  });

  var widgets = createWidgets(opts.indexName);

  widgets.forEach(search.addWidget, search);
  search.start();
}
