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
import s from './Dropdown.css';
import Options from './Options';

class Dropdown extends React.Component {

  static propTypes = {
    brands: PropTypes.shape({ brands: PropTypes.arrayOf(PropTypes.object) }).isRequired,
    maxDataLength: PropTypes.number.isRequired,
    maxTopLength: PropTypes.number.isRequired,
    lazyLoadAmount: PropTypes.number.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    Object.assign(this, {
      state: {
        brands: props.brands.brands,
        shown: false,
        mounted: false,
        search: '',
        lazyLoadAmount: props.lazyLoadAmount,
        hasMore: props.brands.brands.length > 50,
      },
      loadMore: this.loadMore.bind(this),
      filterBrands: this.filterBrands.bind(this),
      updateSearch: this.updateSearch.bind(this),
      onLabelClick: this.onLabelClick.bind(this),
      toggleDropdown: this.toggleDropdown.bind(this),
      onSubmit: this.onSubmit.bind(this),
      clearBrands: this.clearBrands.bind(this),
    });
  }
  componentDidMount() {
    this.filterBrands();
    this.onSubmit();
  }
  onSubmit() {
    const { state: { brands }, props: { onSubmit } } = this;
    onSubmit(brands.filter(item => item.checked));
  }
  onLabelClick(urlIdentifier) {
    const { maxDataLength } = this.props;
    const { brands: rawBrands } = this.state;
    const brands = rawBrands
      .map((item) => {
        if (item.checked && item.urlIdentifier === urlIdentifier) {
          return Object.assign({}, { ...item, checked: false });
        }
        if (item.checked) {
          return item;
        }
        return Object.assign({}, { ...item, checked: item.urlIdentifier === urlIdentifier });
      })
      .filter((item, key) => key < maxDataLength);
    this.setState({ brands }, () => this.onSubmit());
  }
  clearBrands(e) {
    e.preventDefault();
    this.filterBrands();
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
      .map(({ id, synonyms, name, score, urlIdentifier }) =>
        Object.assign({}, { checked: false, id, synonyms, name, score, urlIdentifier }));
    this.setState(() => ({ brands, mounted: true }));
  }
  loadMore() {
    this.setState(({ lazyLoadAmount, brands }, props) => {
      const amount = lazyLoadAmount + props.lazyLoadAmount;
      return ({ lazyLoadAmount: amount, hasMore: brands.length > amount });
    });
  }
  toggleDropdown(e) {
    e.preventDefault();
    this.setState(({ shown, lazyLoadAmount }) => ({ shown: !shown, lazyLoadAmount }));
  }
  updateSearch(e) {
    this.setState({ search: e.target.value }, () => {
      this.filterBrands();
      this.onSubmit();
    });
  }
  render() {
    const { loadMore, updateSearch, onLabelClick, clearBrands } = this;
    const { maxTopLength } = this.props;
    const { mounted, shown, hasMore, brands, lazyLoadAmount } = this.state;
    const selectedMatches = brands.filter(item => item.checked === true);
    const top = [...brands]
      .sort((a, b) => b.score - a.score)
      .splice(0, maxTopLength);
    return (
      <form className={s.Dropdown}>
        <button className={`${s.Dropdown__button} ${shown ? `${s['Dropdown__button--open']}` : ''}`} onClick={this.toggleDropdown}>Brands</button>
        {mounted && shown &&
        <div className={s.Dropdown__container}>
          <div className={s.Dropdown__search}>
            <input className={s.Dropdown__searchInput} type="text" onChange={updateSearch} placeholder="search" />
          </div>
          <div className={s.Dropdown__popup}>
            <InfiniteScroller
              loadMore={loadMore}
              hasMore={hasMore}
              threshold={150}
              useWindow={false}
              loader={<div className={s.Dropdown__loader}>Loading ...</div>}
            >
              <Options
                heading="Top Brands"
                data={top}
                onLabelClick={onLabelClick}
              />
              {selectedMatches.length > 0 &&
              <Options
                heading="Selected Brands"
                onLabelClick={onLabelClick}
                data={selectedMatches}
              />}
              <Options
                heading="All Brands"
                onLabelClick={onLabelClick}
                data={brands.filter((item, key) => key < lazyLoadAmount)}
              />
            </InfiniteScroller>
          </div>
          {selectedMatches.length > 0 &&
          <button className={s.Dropdown__clear} onClick={clearBrands}>Clear Brands</button>}
        </div>}
      </form>
    );
  }

}

export default Dropdown;
