/*
  global $, algoliasearch, algoliasearchHelper, Hogan
*/
// INITIALIZATION
// ==============

// Replace with your own values
const APPLICATION_ID = 'latency';
const SEARCH_ONLY_API_KEY = '6be0576ff61c053d5f9a3225e2a90f76';
const INDEX_NAME = 'bestbuyProducts';
const STRUCTURED_DATA_INDEX_NAME = 'bestbuyProducts_logos';
const PARAMS = {
  hitsPerPage: 10,
  index: INDEX_NAME,
};

// Client + Helper initialization
const algolia = algoliasearch(APPLICATION_ID, SEARCH_ONLY_API_KEY);
const algoliaHelper = algoliasearchHelper(algolia, INDEX_NAME, PARAMS);
const structuredDataHelper = algoliaHelper.derive(searchParameters => {
    const params = searchParameters.setIndex(STRUCTURED_DATA_INDEX_NAME)
    params.getRankingInfo = true
    return params
});

// DOM BINDING
const $searchInput = document.getElementById('search-input');
const $searchInputIcon = document.getElementById('search-input-icon');
const $main = document.getElementsByTagName('main')[0];
const $hits = document.getElementById('hits');
const $stats = document.getElementById('stats');
const $structuredData = document.getElementById('structured-data');
const $pagination = document.getElementById('pagination');

// Hogan templates binding
const hitTemplate = Hogan.compile(document.getElementById('hit-template').innerText);
const statsTemplate = Hogan.compile(document.getElementById('stats-template').innerText);
const paginationTemplate = Hogan.compile(document.getElementById('pagination-template').innerText);
const noResultsTemplate = Hogan.compile(document.getElementById('no-results-template').innerText);
const structuredDataTemplate = Hogan.compile(document.getElementById('structured-data-template').innerText);

// SEARCH BINDING
// ==============

// Input binding
function searchInputHandler(e) {
  const query = e.currentTarget.value;

  toggleIconEmptyInput(query);
  algoliaHelper.setQuery(query).search();
}

$searchInput.addEventListener('input', searchInputHandler);
$searchInput.focus();

// Search errors
algoliaHelper.on('error', error => {
  console.log(error); // eslint-disable-line no-console
});

// Update URL
algoliaHelper.on('change', () => {
  setURLParams();
});

// Search results
algoliaHelper.on('result', content => {
  renderStats(content);
  renderHits(content);
  renderPagination(content);
  handleNoResults(content);
});

structuredDataHelper.on('result', content => {
  renderStructuredData(content);
});

// Initial search
initFromURLParams();
algoliaHelper.search();

// RENDER SEARCH COMPONENTS
// ========================

function renderStats(content) {
  const stats = {
    nbHits: content.nbHits,
    nbHitsPlural: content.nbHits !== 1,
    processingTimeMS: content.processingTimeMS,
  };
  $stats.innerHTML = statsTemplate.render(stats);
}

function renderHits(content) {
  $hits.innerHTML = hitTemplate.render(content);
}

function renderPagination(content) {
  const pages = [];
  let page;
  if (content.page > 3) {
    pages.push({current: false, number: 1});
    pages.push({current: false, number: '...', disabled: true});
  }
  for (page = content.page - 3; page < content.page + 3; ++page) {
    if (page < 0 || page >= content.nbPages) continue;
    pages.push({current: content.page === page, number: page + 1});
  }
  if (content.page + 3 < content.nbPages) {
    pages.push({current: false, number: '...', disabled: true});
    pages.push({current: false, number: content.nbPages});
  }
  const pagination = {
    pages,
    prevPage: content.page > 0 ? content.page : false,
    nextPage: content.page + 1 < content.nbPages ? content.page + 2 : false,
  };
  $pagination.innerHTML = paginationTemplate.render(pagination);
}

function renderStructuredData(content) {
  if (content.hits.length !== 0) {
    // check to see if all matching words are adjacent and in order
    if (content.hits[0]._rankingInfo.words - 1 === content.hits[0]._rankingInfo.proximityDistance) {
      // render only one result
      $structuredData.innerHTML = structuredDataTemplate.render({result: content.hits[0]});
      $structuredData.className = 'show-structured-data';
      return true
    }
  }
  $structuredData.className = '';
}

// NO RESULTS
// ==========

function handleNoResults(content) {
  if (content.nbHits > 0) {
    $main.className = '';
    return;
  }
  $main.classList = $main.classList.add('no-results');
  $hits.innerHTML = noResultsTemplate.render({query: content.query});
}

// EVENTS BINDING
// ==============

// function event

document.getElementById('right-column').addEventListener('click', e => {
  e.preventDefault();
  const clickedElement = e.target;
  if (clickedElement.className.includes('go-to-page')) {
    document.body.scrollTop = 0;
    algoliaHelper.setCurrentPage(Number($(this).data('page')) - 1).search();
  }
});
$searchInputIcon.addEventListener('click', e => {
  e.preventDefault();
  $searchInput.value = '';
  $searchInput.focus();
});

document.getElementById('right-column').addEventListener('click', e => {
  e.preventDefault();
  const clickedElement = e.target;
  if (clickedElement.className.includes('clear-all')) {
    $searchInput.value = '';
    $searchInput.focus();
    algoliaHelper.setQuery('').search();
  }
});

// URL MANAGEMENT
// ==============

function initFromURLParams() {
  const URLString = window.location.search.slice(1);
  const URLParams = algoliasearchHelper.url.getStateFromQueryString(URLString);
  const stateFromURL = Object.assign({}, PARAMS, URLParams);
  $searchInput.value = stateFromURL.query || '';
  algoliaHelper.overrideStateWithoutTriggeringChangeEvent(stateFromURL);
}

let URLHistoryTimer = Date.now();
const URLHistoryThreshold = 700;
function setURLParams() {
  const trackedParameters = ['attribute:*'];
  if (algoliaHelper.state.query.trim() !== '') trackedParameters.push('query');
  if (algoliaHelper.state.page !== 0) trackedParameters.push('page');
  if (algoliaHelper.state.index !== INDEX_NAME) trackedParameters.push('index');

  const URLParams = window.location.search.slice(1);
  const nonAlgoliaURLParams = algoliasearchHelper.url.getUnrecognizedParametersInQueryString(URLParams);
  const nonAlgoliaURLHash = window.location.hash;
  const helperParams = algoliaHelper.getStateAsQueryString({
    filters: trackedParameters, moreAttributes: nonAlgoliaURLParams,
  });
  if (URLParams === helperParams) return;

  const now = Date.now();
  if (URLHistoryTimer > now) {
    window.history.replaceState(null, '', `?${helperParams}${nonAlgoliaURLHash}`);
  } else {
    window.history.pushState(null, '', `?${helperParams}${nonAlgoliaURLHash}`);
  }
  URLHistoryTimer = now + URLHistoryThreshold;
}

window.addEventListener('popstate', () => {
  initFromURLParams();
  algoliaHelper.search();
});

// HELPER METHODS
// ==============

function toggleIconEmptyInput(query) {
  if (query.trim().length) {
    $searchInputIcon.className = $searchInputIcon.className.replace('empty', '');
  }
}
