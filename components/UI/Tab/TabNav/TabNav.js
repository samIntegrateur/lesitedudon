import React from 'react';

const TabNav = (props) => {
  return (
    <nav>
      <ul>
        {
          props.tabs.map((tab, index) => (
            <li key={tab.title} className={index === props.tabActive ? 'active' : ''}>
              <button type="button" onClick={() => props.clicked(index)}>
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
