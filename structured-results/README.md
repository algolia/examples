# Structured Data Demo

This is a sample project implementing a full page search with structured data results using [Algolia](https://www.algolia.com).

![Structured Data](./structured_data.gif)

## Usage

### Open the project

Open app/index.html in your browser

Replace the demo credentials with your own:
- in `app/js/script.js`, set your own `APPLICATION_ID` instead of `"VC519DRAY3"` (which is our demo `APPLICATION_ID`),
- in `app/js/script.js`, set your own `SEARCH_ONLY_API_KEY` instead of `"5c796d39dcd489e62b89b38dae03fbc4"`,
- in `app/js/script.js`, set your own `INDEX_NAME` and `STRUCTURED_DATA_INDEX_NAME` names instead of `"altCorrecTest"` and `"altCorrecTest_logos"`

# Background

One of the more interesting, more-recent additions to search engine results pages are so-called "structured results." Different people have different names: Google calls them "knowledge graph cards" while Bing has "visually rich snippets." DuckDuckGo, Yandex, and Baidu, all have them as well.

How about your search?

Uses for Structured Results

You'll want to use structured results whenever there is a singular piece of information you want to stand out from the rest for a given query. Here are a few examples:
    • Sponsored results on an eCommerce search. See our guide specific to this topic here.
    • Movie times on an entertainment website
    • User details on a CRM

This example uses sample data from the Best Buy API and top tech consumer brands and their respective logos for structured data results.

## Features

* Full-JavaScript/frontend implementation based on [algolia search helper](https://community.algolia.com/algoliasearch-helper-js/)
* Results page refreshed as you type
* Recommended Structured Data results as you type
* Hits
* Pagination
* Relevant results from the first keystroke
* Typo-tolerance
* By Relevance
* Backup search parameters in the URL
