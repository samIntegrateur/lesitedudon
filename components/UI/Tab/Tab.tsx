import React from 'react';
import TabNav from './TabNav/TabNav';
import TabContent from './TabContent/TabContent';
import classes from './Tab.module.css';
import { TabProps } from "./Tab.type";

// todo: responsive and accessibility
// Implement reusable logic (cf: AccountTab)
// Nb: ActiveComponent with A uppercase is required to use it as component
const Tab: React.FC<TabProps> = (
  {
    tabs,
    tabActive,
    clicked,
    ActiveComponent,
  }
): JSX.Element => {

  return (
    <section className={classes.tab}>
      <TabNav
        tabs={tabs}
        tabActive={tabActive}
        clicked={clicked} />
      <TabContent>
        <h2 className="sr-only">{tabs[tabActive].title}</h2>
        <ActiveComponent />
      </TabContent>
    </section>
  );
};

export default Tab;
