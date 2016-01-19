For very visual websites, such as those built around photo sharing, infinite scroll can be a nice experience for users. For your users, they can view hundreds of results through only scrolling. For you, you get users who are more engaged and spend more time on your website.

Algolia only returns 1,000 results through the default search functionality. We do this to ensure very fast searches. It is rare that result 1,001 is what the user is looking for, so limiting searched results to this number allows us to speed up our search results.

To get more than 1,000 results, we will have to leverage the `browse` functionality.

Using `browse` doesn't use all of the ranking strategy that search does which means that we don't want to use browse from the outset, as the default search will give us the best results.

This also means that once we get past 1,000 results we will see some duplication with the first 1,000. You could try to dedupe these but we wouldn't recommend it. Past 1,000 results the user won't be caught too off-guard if they do spot duplication and any attempts to remove duplicates will lead to a degrading of performance.

## Getting Started

All of our code lives on [github](#TODO) so you can refer to it there. Note that we use webpack to build our JavaScript, but webpack is not a dependency for building infinite scroll searching.

We're going to use [instantsearch.js](#TODO). While not a strict requirement for building infinite scroll, this library lets us set up instant search results quickly and with as little code as possible. It also gives us the capability to build custom widgets, which we'll be doing here.

Create the following file structure:
index.html
- css
 |- style.css
- js
 |- js/infinitescroll.js

If you want to follow along precisely, you can also [download the images](#TODO) and add them inside an `img` directory. Grab [the CSS](#TODO) as well and add it to the `style.css` file.

## The HTML

Setting up our index.html, we start with the following code:

```
<!DOCTYPE html>
<html>
<head>
  <title>Infinite Scroll Instant Search Example</title>
  <meta name="description" content="Example of an infinite scroll implementation using Algolia's instantsearch.js">
  <!--[if lte IE 9]>
    <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
  <![endif]-->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/instantsearch.js/1/instantsearch.min.css">
  <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>

  <script src="https://cdn.jsdelivr.net/instantsearch.js/1/instantsearch.min.js"></script>
  <script src="js/ifinite_scroll.js"></script>
</body>
```

We are loading the `instantsearch.js` library from JSDelivr, but you can bring it into your project through Bower, NPM, or manually.

We're also loading the CSS that provides some default styles for the instant search. This is optional if you want to completely style the results from scratch.

## Adding the Search Bar and Results

Next we'll add our search bar and display our results, which instantsearch.js will hook into. Add this to the top of the `body`:

```
<header>
  <a href="/"><img src="img/instant_search_logo@2x.png"/></a>
  <input id="search-input" type="text" placeholder="Search for products"/>
  <div id="search-input-icon"></div>
</header>
```

And then add this below it:

```
<main>
  <div id="right-column">
    <div id="hits"></div>
  </div>
</main>
```

## Connecting instantsearch.js

We want to start by instantiating instantsearch:

```
var search = instantsearch({
  appId: opts.appId,
  apiKey: opts.apiKey,
  indexName: opts.indexName,
  searchParameters: {
    attributesToSnippet: 'name:9'
  },
  urlSync: {
    useHash: true
  }
});
```

Our app ID, API key, and index name can all be retrieved from the Algolia dashboard.

`searchParameters` is our initial search configuration. Here we're saying that we want our name attribute inside the search results to be snippeted--or limited to just nine words.

`urlSync` tells instantsearch.js to synchronize the URL with the current search parameters. There are a [number of different options](https://github.com/algolia/instantsearch.js#url-synchronisation), but for us we are setting `useHash` to `true`, which means our URL will be hash based rather than using query parameters.

## Adding Our instantsearch.js Widgets

Right now our search doesn't do anything, and that's because we haven't added any widgets. We need to add, at least, our search box and our results.

We need to first create our widgets.

```
var searchBoxWidget = instantsearch.widgets.searchBox({
  container: '#search-input'
});

var infiniteScrollWidget = infiniteScrollWidget({
  container: '#hits',
  templates: {
    items: document.querySelector('#hits-template').innerHTML,
    empty: document.querySelector('#no-results-template').innerHTML
  }
});

```

The container is in reference to the elements we added earlier inside of our HTML. This is where our widget will live inside of the DOM.

For the infinite scroll widget, we also need to specify templates, or views. We're going to be using mustache templates, which we'll come back to in a little bit.

Finally, let's add our widget to the instantsearch.js instance and start listening for searches:

```
search.addWidget(searchBoxWidget);
search.addWidget(infiniteScrollWidget);
search.start();
```

## Creating Our Custom Widget

Earlier, we added two widgets to our instantsearch.js instance. The search box widget is one that comes out of the box with instantsearch.js. In contrast, infinite scroll is a custom widget that we will create ourselves.

Start out with this:

```
var cursor, index, page, nbPages, loading;

var infiniteScrollWidget = function(options){
  var container = document.querySelector(options.container);
  var templates = options.templates;

  if(!container) {
    throw new Error('infiniteScroll: cannot select \'' + options.container + '\'');
  }

  return {
    init: function(){},
    render: function(args){}
  }
};
```

A custom widget is an object that exposes two or three methods. Both `init` and `render` are always required.

The `init` method initializes the widget before the first search. It accepts an object that has the search `state`, the search `helper`, and the configuration of the templates: the `templatesConfig`.

Meanwhile, the `render` method is called after the search results are returned from Algolia. This also accepts an object with the `results` of the query, the search `state`, the search `helper`, and a function (`createURL`) to create a URL with the search parameters.

Optionally, you can expose a `getConfiguration` method, which can configure the underlying AlgoliaSearch JS helper. It takes [SearchParameters](https://community.algolia.com/algoliasearch-helper-js/docs/SearchParameters.html) and is expected to return an object of configuration properties.

To make the widget easier to configure, we usually have a function like `infiniteScrollWidget` that takes in options and returns the configured widget object.

## Rendering Results

To render our results we will leverage [mustache](https://github.com/janl/mustache.js) templates. Place them at the bottom of the index.html:

```
<script type="text/html" id="hits-template">
  <div class="hits">
    {{#pageNo}}
      <div class="page-no">
        Page {{pageNo}}
      </div>
    {{/pageNo}}
    {{#hits}}
      <div class="hit">
        <a href="{{url}}">
          <img src="{{image}}" alt="{{name}}">
          <p class="name">
            {{#_snippetResult}}
              {{{_snippetResult.name.value}}}
            {{/_snippetResult}}
            {{^_snippetResult}}
              {{name}}
            {{/_snippetResult}}
          </p>
        </a>
      </div>
    {{/hits}}
  </div>
</script>

<script type="text/html" id="no-results-template">
  <div id="no-results-message">
    <p>We didn&rsquo;t find any results for the search <em>&ldquo;{{query}}&rdquo;</em></p>
    <a href="#" class="clear-all">Clear all</a>
  </div>
</script>
```

The first template will be filled with information from each search hit, while the second template will be rendered if we have no results.

Let's create a function to render out our templates:

```
var renderTemplate = function(template, res){
  var results = document.createElement('div');
  results.innerHTML = Mustache.render(template, res);
  return results;
};
```

Then we'll create a function to render our search results after a search is made:

```
var initialRender = function(container, args, templates, parent){
  if(args.results.nbHits) {
    args.results.pageNo = page + 1;
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

```

And call it from within the render method of our infinite scroll widget:

```
var infiniteScrollWidget = function(options) {
  // ...
  return {
    // ...
    render: function(args) {
      initialRender(container, args, templates);
    }
  };
};
```

All we're doing is checking to see if there are any results (`nbHits`), rendering them if there are, otherwise rendering our page that says there are none.

## Adding Our Infinite Scroll

We've got great search results now, but we don't yet have infinite scrolling. Let's outline what we need for infinite scroll results:

- Listen for the user scrolling through the results
- When the user gets close to the end of the results, ask Algolia for the next set
- Append the new hits to the end of the results

There's one more thing that's easy to gloss over:

- When a user makes a new search, stop listening for the previous scroll event

This last aspect is important because with instant search results, we are counting every key stroke as a new search. If a user searches for "hot dog" and we don't remove any event listeners, will have seven at the end of the search. Even more if the user mistypes and originally types "hog dot" before correcting the search.

Because of this we will need to create a named function and it will have to live outside of our render method, so that it can be removed in the initialization of the widget (remember, the widget reinitializes before each new search).

Here are the functions we need:

```
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

var addSearchedRecords = function(){
  if(!loading && page < nbPages - 1) {
    loading = true;
    page += 1;
    helper.searchOnce({page: page}, appendSearchResults.bind(this));
  }
};

var appendSearchResults = function(err, res, state){
  page = res.page;
  args.results.pageNo = page + 1;
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
```

That's a lot to take in all at once, so let's go through it one-by-one.

```
var cursor, index, page, nbPages, loading;

var hitsDiv = document.getElementById('hits');
```

We're creating variables outside of our widget or our functions because we need to access and update these in a number of different places (e.g. `init`, `render`) and dependency injection isn't always feasible. Be careful to not make these global to your app.

```
var scrolledNearBottom = function(el){
  return (el.scrollHeight - el.scrollTop) < 850;
};

var searchNewRecords = function(){
  if(scrolledNearBottom(hitsDiv)) {
    addSearchedRecords.call(this);
  }
};
```

As the user scrolls, we will be checking to see if they are near enough to the bottom that we need to grab new results. We've set this to return `true` when the user is 850 pixels from the bottom, but you can change this to your needs.

```
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
```

Then, make sure it's being invoked as the user is scrolling:

```
var infiniteScrollWidget = function(options) {
  // ...
  return {
    var scope = {
      templates: templates,
      container: container,
      args: args,
      offset: offset
    };

    if(args.results.nbHits) {
      hitsDiv.addEventListener('scroll', searchNewRecords.bind(scope));
    }

    render: function(args) {
      initialRender(container, args, templates);
    }
  };
};
```

Next up, we want to check two things: that the next set of results isn't loading and that we aren't at the end.

If both of those are the case, we signal that the results are loading and search for results, specifying the page and using the algolia search helper. When the results have returned, the helper will call our `appendSearchResults` callback.

That callback is pretty simple: we take our results, add a `pageNo` property to the object, and pass it to mustache. The last part deserves a closer look. If:

- We have reached the final page **and**
- The total number of hits for that search is greater than the number we've displayed

**Then** we need to switch from searching our records to browsing them.

First, a detour.

## Searching vs Browsing

One thing to be aware of is that Algolia will return at most the first 1,000 results for any search. This allows us to return results quickly and with maximum relevancy. In nearly all settings, you won't need more than 1,000 results.

Buf if you do—as with infinite scrolling—there is a way to get them. This is through the `browse` method. Using `browse`, Algolia doesn't take into account all of the ranking criteria. We, then, necessarily lose relevance when compared to the default search method.

Your basic API key won't work with the `browse` method, either. Since someone, such as a competitor, can get all of your results through `browse`, we require an explicit decision on your part to enable this functionality. You enable it with an API key you have created specifically for this purpose.

To decrease the chance of someone fetching all of your results, the API key you create should be limited to allow browsing only, limited to your website or app, and restricted in terms of terms of how many API calls can be made per IP per hour.

You can create an API key for this purpose in the [credentials](https://www.algolia.com/licensing) section of your dashboard. You also **must** host your site on HTTPS to use browse.

Another difference between searching and browsing is how to approach pagination. While you can use pagination while browsing through records, it is much slower. Instead, we recommend for you to use a hexidecimal cursor that is returned with your results, which will create the correct offset.

## Browsing Records

We will next add our methods for browsing through records as the user scrolls.

```
var browseNewRecords = function(){
  if(scrolledNearBottom(hitsDiv)) {
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
```

This is very similar to what we saw before. The big difference now is that we are checking for the presence of a cursor. If we don't find it, we will browse from the very beginning. If we do, then we use that to create an offset.

And that's all there is to it. Here are the big takeaways:

- We can create our own custom widgets for instantsearch.js using Mustache, react, or vanilla JavaScript
- The `search` method will give us up to 1,000 results for any query
- If we need more than 1,000 results then we must use the `browse` method
- The `browse` method sends us results with less relevancy, so it's recommended to only use it from result number 1,000 on
