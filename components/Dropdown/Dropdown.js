/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import InfiniteScroller from 'react-infinite-scroller';

class Dropdown extends React.Component {

  static propTypes = {
    brands: PropTypes.shape({ brands: PropTypes.arrayOf(PropTypes.object) }).isRequired,
    maxDataLength: PropTypes.number.isRequired,
    lazyLoadAmount: PropTypes.number.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      brands: props.brands.brands,
      shown: false,
      mounted: false,
      top: [],
      search: '',
      lazyLoadAmount: props.lazyLoadAmount,
      hasMore: props.brands.brands.length > 50,
      selectedMatches: [],
    };
    this.loadMore = this.loadMore.bind(this);
    this.filterBrands = this.filterBrands.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    this.filterBrands();
    this.onSubmit();
  }
  onSubmit() {
    const { state: { selectedMatches }, props: { onSubmit } } = this;
    onSubmit(selectedMatches);
  }
  getElements(props, amount) {
    const top = [...props]
      .sort((a, b) => b.score - a.score)
      .splice(0, amount);
    this.setState({ top });
  }
  filterBrands() {
    const { search } = this.state;
    const { maxDataLength, brands: { brands: rawBrands } } = this.props;

    const normalizeWord = word => word.toLowerCase();
    const normalizedSearch = normalizeWord(search);

    const brands = [...rawBrands]
      .sort((a, b) => b.score - a.score)
      .filter(({ synonyms, name }) => {
        if (search === '') {
          return true;
        }
        const matched = synonyms
          .filter(word => normalizeWord(word).includes(normalizedSearch));

        return matched.length || normalizeWord(name).includes(normalizedSearch);
      })
      .filter((item, key) => key < maxDataLength)
      .sort((a, b) => (a.name).localeCompare(b.name))
      .map(({ id, synonyms, name, score }) => Object.assign({}, { id, synonyms, name, score }));
    this.setState(() => ({ brands, mounted: true }));
    this.getElements(rawBrands, 5);
  }
  loadMore() {
    this.setState(({ lazyLoadAmount, brands }) =>
      ({ lazyLoadAmount: lazyLoadAmount + 50, hasMore: brands.length > lazyLoadAmount + 50 }),
    );
  }
  toggleDropdown(e) {
    e.preventDefault();
    this.setState(({ shown, lazyLoadAmount }) => ({ shown: !shown, lazyLoadAmount }));
  }
  updateInput({ target: { value } }) {
    const { selectedMatches } = this.state;
    let arr = selectedMatches;
    if (selectedMatches.includes(value)) {
      arr = selectedMatches.filter(item => !(item === value));
    } else {
      arr = [...arr, value];
    }
    this.setState(() => ({ selectedMatches: arr }), () => this.onSubmit());
  }
  updateSearch(e) {
    this.setState({ search: e.target.value, selectedMatches: [] }, () => {
      this.filterBrands();
      this.onSubmit();
    });
  }
  render() {
    const { top, mounted, shown, hasMore, brands, lazyLoadAmount } = this.state;
    const { loadMore, updateSearch, updateInput } = this;
    const renderInput = ({ id, name }, uniqueId = '') => (
      <div key={id} style={{ height: 20 }}>
        <label htmlFor={`${id}${uniqueId}`}>
          <input id={`${id}${uniqueId}`} onChange={updateInput} type="checkbox" value={name} />{name}
        </label>
      </div>);
    return (
      <form>
        <button onClick={this.toggleDropdown}>Brands</button>
        {mounted && shown &&
        <div
          style={{ height: 300, width: 400, overflowY: 'scroll' }}
        >
          <input type="text" onChange={updateSearch} placeholder="search" />
          <InfiniteScroller
            loadMore={loadMore}
            hasMore={hasMore}
            threshold={150}
            useWindow={false}
            loader={<div className="loader">Loading ...</div>}
          >
            <b>Top Brands</b>
            {top.map(item => renderInput(item, 'top'))}
            <b>All Brands</b>
            {brands
              .filter((item, key) => key < lazyLoadAmount)
              .map(item => renderInput(item))
            }
          </InfiniteScroller>
        </div>}
        <button>Submit</button>
      </form>
    );
  }

}

export default Dropdown;
