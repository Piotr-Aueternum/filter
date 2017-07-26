import React, { PropTypes } from 'react';
import Option from './Option';
import s from './Options.css';

const propTypes = {
  onLabelClick: PropTypes.func,
  heading: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })).isRequired,
};

const Options = ({ data, onLabelClick, heading }) => (
  <div className={s.Options}>
    <div className={s.Options__heading}>{heading}</div>
    <ul className={s.Options__list}>
      {data.map(item => (
        <li className={s.Options__item} key={item.id}>
          <Option
            {...item}
            onLabelClick={onLabelClick}
          />
        </li>
      ))}
    </ul>
  </div>
);

Options.propTypes = propTypes;

export default Options;
