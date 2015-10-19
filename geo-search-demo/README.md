Geo-Search Demo
====================

This is a sample project implementing an geo-search based website with Google Maps and [Algolia](http://www.algolia.com). Algolia is a Search API that provides hosted full-text, numerical and faceted search.

## Features
* Full JavaScript (based on [jQuery](http://jquery.com/), [Hogan.js](http://twitter.github.io/hogan.js/), [Google Maps](https://developers.google.com/maps) and [AlgoliaSearch](https://github.com/algolia/algoliasearch-client-js) + [helper](https://github.com/algolia/algoliasearch-helper-js))
* Search inside a bounding Box
* Search inside a bounding Polygon
* Search inside an union of Shapes
* Search around a location (via Lat/Lng)
* Search around a location (via IP Address)

## Usage

We've included some credentials in the code allowing you to test the demo without any Algolia account. If you want to replicate this demo using your own Algolia credentials, you can use the ```import.rb``` script to send the data and configure the indices.

```
./import.rb YourApplicationID YourAPIKey YourIndexName
```

Then, you'll need to replace the demo credentials with your own:
- in ```js/app.js```, set your own ```APPLICATION_ID``` instead of ```"latency"``` (which is our demo ```APPLICATION_ID```),
- in ```js/app.js```, set your own ```SEARCH_ONLY_API_KEY``` instead of ```"6be0576ff61c053d5f9a3225e2a90f76"```,
- in ```js/app.js```, set your own ```index``` name instead of ```"instant_search"```.


## Tutorial

**Follow this [tutorial](https://www.algolia.com/doc/tutorials/geo-search) (on Algolia.com) to learn how this implementation works** and how it has been built using the [Algolia's Javascript API client](https://github.com/algolia/algoliasearch-client-js) and its [helper](https://github.com/algolia/algoliasearch-helper-js).

## Demo
Try out the [demo](http://demos.algolia.com/geo-search-demo/)
![Geo search](geo-search.gif)

## Data Set
We've used a list of 3,282 airports from [OpenFlight.org](http://openflights.org/data.html).

## Run and develop locally

To hack and develop on this current repository:

```sh
git clone git@github.com:algolia/examples/geo-search-demo.git
npm install
npm run dev
```