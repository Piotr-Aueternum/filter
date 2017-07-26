import React, { PropTypes } from 'react';
import s from './Option.css';

/* eslint-disable jsx-a11y/no-static-element-interactions */
class Option extends React.Component {
  static propTypes = {
    checked: PropTypes.bool,
    onLabelClick: PropTypes.func,
    name: PropTypes.string.isRequired,
    urlIdentifier: PropTypes.string.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      checked: props.checked,
    };
    this.onLabelClick = this.onLabelClick.bind(this);
  }
  componentWillReceiveProps(props) {
    const { checked, name } = props;
    this.setState({ checked, name });
  }
  onLabelClick(e) {
    e.preventDefault();
    this.props.onLabelClick(this.props.urlIdentifier);
  }
  render() {
    const { name, checked } = this.props;
    const { onLabelClick } = this;
    return (
      <button onClick={onLabelClick} className={`${checked ? s['Option--checked'] : ''} ${s.Option}`}>
        {name}
      </button>
    );
  }
}
/* eslint-enable jsx-a11y/no-static-element-interactions */
export default Option;
