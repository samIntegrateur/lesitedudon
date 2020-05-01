import React from 'react';
import classes from './TabNav.module.css';
import { TabNavProps } from "../Tab.type";

const TabNav: React.FC<TabNavProps> = (
  {
    tabs,
    tabActive,
    clicked,
  }
): JSX.Element => {
  return (
    <nav className={classes.tabNav}>
      <ul className={classes.tabNav__list}>
        {
          tabs.map((tab, index) => (
            <li
              key={tab.title}
              className={`${classes.tabNav__listItem} ${index === tabActive ? classes.isActive : ''}`}>
              <button type="button"
                      className={classes.tabNav__btn}
                      onClick={(): void => clicked(index)}>
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
