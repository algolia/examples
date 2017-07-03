/* eslint react/prop-types: 0 */

import React from 'react';
import { createConnector } from 'react-instantsearch';
import {
  InstantSearch,
  SearchBox,
  RefinementList,
  SortBy,
  Stats,
  Pagination,
  Highlight,
  Menu,
  ClearAll,
  Hits,
} from 'react-instantsearch/dom';
import { connectRange } from 'react-instantsearch/connectors';
import { withUrlSync } from './urlSync';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';

const App = props =>
  <InstantSearch
    apiKey="6be0576ff61c053d5f9a3225e2a90f76"
    appId="latency"
    className="container-fluid"
    createURL={props.createURL}
    indexName="instant_search"
    onSearchStateChange={props.onSearchStateChange}
    searchParameters={{ hitsPerPage: 10 }}
    searchState={props.searchState}
  >
    <header id="header">
      <img alt="instant-search-logo" src="instant_search_logo@2x.png" />
      <SearchBox translations={{ placeholder: 'Search for products' }} />
    </header>
    <main>
      <Content />
    </main>
    <footer>
      Source Code on
      <a href="https://github.com/algolia/instantsearch.js/tree/v2/docgen/src/examples/demo">
        Github
      </a>{' '}
      - Powered by <a href="https://www.algolia.com">Algolia</a> - Data from{' '}
      <a href="https://developer.bestbuy.com">Best Buy</a>
    </footer>
  </InstantSearch>;

const RightColumn = () =>
  <div id="right-column">
    <div className="info">
      <Stats />
      <SortBy
        defaultRefinement="instant_search"
        items={[
          { value: 'instant_search', label: 'Most Relevant' },
          { value: 'instant_search_price_asc', label: 'Lowest Price' },
          { value: 'instant_search_price_desc', label: 'Highest Price' },
        ]}
      />
    </div>
    <Hits hitComponent={Hit} />
    <div id="pagination">
      <Pagination showLast />
    </div>
  </div>;

const Content = createConnector({
  displayName: 'ConditionalResults',
  getProvidedProps(props, searchState, searchResults) {
    const noResults = searchResults.results
      ? searchResults.results.nbHits === 0
      : false;
    return { query: searchState.query, noResults };
  },
})(({ noResults, query }) => {
  const rightColumn = noResults
    ? <div id="no-results-message">
        <p>
          We didn't find any results for the search <em>{query}</em>.
        </p>
        <ClearAll />
      </div>
    : <RightColumn />;
  return (
    <div>
      <div className={noResults ? 'no-results' : ''} id="left-column">
        <h5>Category</h5>
        <RefinementList attributeName="categories" />
        <h5>Brand</h5>
        <RefinementList
          attributeName="brand"
          withSearchBox
          translations={{ noResults: 'No matching brand' }}
        />
        <h5>Price</h5>
        <ConnectedRange attributeName="price" />
        <h5>Type</h5>
        <Menu attributeName="type" />
      </div>
      {rightColumn}
    </div>
  );
});

class Range extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentValues: { min: this.props.min, max: this.props.max },
    };
    this.onValuesUpdated = this.onValuesUpdated.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(sliderState) {
    this.setState({
      currentValues: {
        min: sliderState.currentRefinement.min,
        max: sliderState.currentRefinement.max,
      },
    });
  }

  onValuesUpdated(values) {
    this.setState({ currentValues: { min: values[0], max: values[1] } });
  }

  onChange(values) {
    if (
      this.props.currentRefinement.min !== values[0] ||
      this.props.currentRefinement.max !== values[1]
    ) {
      this.props.refine({ min: values[0], max: values[1] });
    }
  }

  render() {
    const { min = 0, max = 0 } = this.props;
    const { currentValues } = this.state;

    return (
      <div className="ais-Slider__root">
        {currentValues.min === undefined && currentValues.max === undefined
          ? null
          : <Slider
              max={Math.trunc(max)}
              min={Math.trunc(min)}
              onAfterChange={this.onChange}
              onChange={this.onValuesUpdated}
              range
              value={[currentValues.min, currentValues.max]}
            />}
        <div className="ais-Slider__values">
          <div>
            {min}
          </div>
          <div>
            {max}
          </div>
        </div>
      </div>
    );
  }
}

Range.propTypes = {
  currentRefinement: PropTypes.object,
  max: PropTypes.number,
  min: PropTypes.number,
  refine: PropTypes.func,
};

const ConnectedRange = connectRange(Range);

function Hit({ hit }) {
  return (
    <div className="hit">
      <div className="hit-image">
        <img alt={hit.name} src={`${hit.image}`} />
      </div>
      <div className="hit-content">
        <div className="hit-price">
          ${hit.price}
        </div>
        <div className="hit-name">
          <Highlight attributeName="name" hit={hit} />
        </div>
        <div className="hit-description">
          <Highlight attributeName="description" hit={hit} />
        </div>
      </div>
    </div>
  );
}

export default withUrlSync(App);
