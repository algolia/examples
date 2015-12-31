require('../css/style.css');

var app = require('./search/results.js');

app({
  appId: 'latency',
  apiKey: 'dd2a279afbf87aaeb8ed1604ffc5c349', // Special API key generated to allow browsing
  indexName: 'instant_search'
});
