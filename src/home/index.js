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
import Layout from '../../components/Layout';
import Dropdown from '../../components/Dropdown';
import s from './styles.css';
import { title } from './index.md';

class HomePage extends React.Component {
  static propTypes = {
    brands: PropTypes.shape({ brands: PropTypes.arrayOf(PropTypes.object) }).isRequired,
  };
  componentDidMount() {
    document.title = title;
  }
  render() {
    const { brands } = this.props;
    return (
      <Layout className={s.content}>
        <Dropdown
          maxDataLength={1000}
          onSubmit={(data) => { document.getElementById('selected').innerHTML = data.map(item => `${item.urlIdentifier}`); }}
          lazyLoadAmount={50}
          maxTopLength={5}
          brands={brands}
        />
        <div id="selected" />
      </Layout>
    );
  }

}

export default HomePage;
