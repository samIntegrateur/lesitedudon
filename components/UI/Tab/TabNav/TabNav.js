import React from 'react';
import classes from './TabNav.module.css';

const TabNav = (props) => {
  return (
    <nav className={classes.tabNav}>
      <ul className={classes.tabNav__list}>
        {
          props.tabs.map((tab, index) => (
            <li
              key={tab.title}
              className={`${classes.tabNav__listItem} ${index === props.tabActive ? classes.isActive : ''}`}>
              <button type="button"
                      className={classes.tabNav__btn}
                      onClick={() => props.clicked(index)}>
                {tab.title}
              </button>
            </li>
          ))
        }
      </ul>
    </nav>
  );
};

export default TabNav;
