# Introduction


This tutorial will walk through how to display results “as you type” in an autocomplete menu using Algolia’s search engine. We’ll be building this feature with our [autocomplete.js](https://github.com/algolia/autocomplete.js) JavaScript library.


Let’s begin by examining a possible use case: searching for players on a team. An autocomplete dropdown will help users easily find the player they are looking for within a few keystrokes.


#Importing Your Data


Before you begin, you will have to import your data to our servers either via the dashboard or the API. You can find more extensive information on importing and synchronizing your data in our [import guide](https://www.algolia.com/doc/guides/indexing/import-synchronize-data).

For this example, we will import player data [(download JSON file)](https://www.algolia.com/players.json) that includes the player’s name, team, and points. You can find a sample extract below.

-- JSON extract here --

#Settings


## Searchable attributes


By default, all the attributes in your records will be searchable. For this example, we want users to be able to search by player name and team, but not by points. To accomplish this functionality, we will need to set up a list of attributes to index. You can find further information on creating your searchable attributes list in our [attributes to index guide](https://www.algolia.com/doc/guides/relevance/ranking#attributes-to-index).

-- Searchable attributes dashboard screenshot here --

Since searching for a player by name is our primary use case, we should indicate this attribute is more important by placing it at the top of the list.


## Custom Ranking


To ensure users see the most relevant players, we will take into account the amount of points each player has scored (the higher the scores, the better). For that, we’ll configure the `points` attribute in the setting `customRanking`. You can refer to our [custom ranking guide](https://www.algolia.com/doc/guides/relevance/ranking#custom-ranking) for additional information regarding custom ranking setup.

-- Custom ranking dashboard screenshot here --

Since we would like higher scoring players to appear first, we have set the points attribute to descending sort order.


Alternatively, these settings can be configured via the API client (see example code snippets below).

-- Code snippets for configuring settings here --

# User Interface

The easiest way to render an autocomplete dropdown menu is to use our [autocomplete.js](https://github.com/algolia/autocomplete.js) JavaScript library. It provides an out of the box autocomplete menu that can be easily configured and integrated with Algolia's realtime search engine.

We have created a live demo of a basic autocomplete menu using the autocomplete library that allows users to search for players. Try querying by both player name (e.g. "Kobe Bryant") and team (e.g. "Lakers")!


## Try It - Live Demo

-- Demo of basic autocomplete here --

-- Code for basic autocomplete here --

Tip: Try out our [Searchbox tool](http://shipow.github.io/searchbox/) for easy search input styling!

## Options


The autocomplete.js library provides several [options](https://github.com/algolia/autocomplete.js#options) out of the box for further customization. These can be configured on initialize of an autocomplete menu. In the example above, setting `hint: false` disables the hint text that by default appears in the search input.


Tip: Setting `debug: true` will prevent auto-closing of the menu and make styling easier!

## Highlighting Results

Technically, suggestion attributes can be accessed in the suggestion templating function at `suggestion.attribute_name`. However, we recommend accessing the content of suggestion attributes at `suggestion._highlightResult.attribute_name.value`. As a result, matched words will be wrapped with an HTML tag, which can be styled to indicate to users what portion of their query matches a suggestion.


# Leveraging Custom Events


We can improve the user experience of our autocomplete menu by adding a common UI pattern: an "X" icon that appears when text has been entered that allows users to easily clear their queries. To add this functionality, we will take advantage of the [custom events](https://github.com/algolia/autocomplete.js#custom-events) the autocomplete.js library triggers. 


You can find a working demo of this type of search experience below. Try entering a query, and then clearing it by clicking the "X" icon!


## Try It - Live Demo

-- Demo of basic autocomplete with 'X' here --

-- Markup / JS for demo here --

For this use case, we need to attach the `autocomplete:updated` custom event handler to the autocomplete element. This event will be triggered every time a dataset is rendered. Inside this method, we need to check if text has been entered in the search input field, and then add a class to the parent container indicating if the child input has value. If the search input has no text entered in it, we will remove the class from the parent container.


Additionally, we added a click event onto the new search icon to handle clearing the search input and removing the respective class from the parent container.


To correctly show or hide the appropriate icons based on our new class, we will need additional CSS.

-- CSS/SCSS for demo here --

When the `.input-has-value` class has been added to the container, we hide the general input search icon. Conversely, the 'X' icon is hidden by default, and then shown when the parent container has the `.input-has-value` class.


# Multi-Category


Our existing autocomplete could be improved by adding the ability for users to access not only **player** but also **team** information. To accomplish this, we will need to create a new "team" index and import team data [(download JSON file)](https://www.algolia.com/teams.json). You can view a sample extract of the team data below.

-- JSON extract here --

Just as we did for our initial players index, we will need to specify both searchable attributes and custom ranking criterion. In this case, it makes sense to allow users to search by team name or location, as both of these attributes will be displayed. To rank the teams, we have added a "score" attribute that reflects the average of the points of a team's respective players.

-- Dashboard screenshot here --

-- Code snippet for settings here --

# Multi-Category User Interface


In our demo below, we display both player and team results with their respective searchable attributes. To help users contextualize the suggestions, we have included category headers (e.g., the player information has a "Players" title). Additionally, we reduced the hits per page from 5 to 3 to prevent an overly lengthy menu. 


## Try It - Live Demo

-- Multi-category demo here --

-- Multi-category markup/JS here --

Tip: Use the `header` template to provide category headers!

-- Multi-category CSS/SCSS here --

## Rich Horizontal User Interface

For multi-category autocomplete menus, a horizontal display often provides a better user experience than a vertical display. The increased size allows for more results to be displayed without the need for scrolling, which helps users more easily find information. We can also take advantage of the additional space to display images of the team logos. 


With a few additional lines of CSS, we can easily convert our existing vertical display to be horizontal. 


## Try It - Live Demo

-- Horizontal multi-category demo here --

-- Horizontal multi-category markup/JS here --

Tip: Use the `empty` template to let users know when no results have been found!

-- Horizontal multi-category CSS/SCSS here --

Media-rich multi-category autocomplete menus offer many possibilities for engaging users. You can find an example of a more complex multi-category dropdown menu live on [birchbox.fr](http://birchbox.fr).


-- Birchbox example here --
