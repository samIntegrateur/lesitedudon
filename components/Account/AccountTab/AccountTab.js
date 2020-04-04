import React, {useEffect, useState} from 'react';
import Tab from '../../UI/Tab/Tab';
import {withRouter} from 'next/router';
import dynamic from 'next/dynamic';
import Spinner from '../../UI/Spinner/Spinner';

const dynamicOptions = {
  ssr: false,
  loading: () => <Spinner small />
};

const Profile = dynamic(() => import('../Profile/Profile'), dynamicOptions);
const Offers = dynamic(() => import('../Offers/Offers'), dynamicOptions);
const Conversations = dynamic(() => import('../Conversations/Conversations'), dynamicOptions);

const AccountTab = ({router}) => {

  const tabs = [
    {
      title: 'Mon Profil',
      query: 'Profil',
      component: Profile,
    },
    {
      title: 'Mes annonces',
      query: 'Annonces',
      component: Offers,
    },
    {
      title: 'Mes conversations',
      query: 'Conversations',
      component: Conversations,
    }
  ];

  const [tabActive, setTabActive] = useState(0);

  const [ActiveComponent, setActiveComponent] = useState(tabs[tabActive].component);

  useEffect(() => {
    const tab = router.query.tab;
    const activeTab = getTab(tab);
    if (activeTab) {
      setTabActive(activeTab.key);
      setActiveComponent(activeTab.component);
    }
  }, [router]);

  const clickHandler = (index) => {
    // change url without reloading
    const query = tabs[index].query;
    const href = `/compte?tab=${query}`;
    const as = href;
    router.push(href, as, {shallow: true});
  };

  const getTab = (tab) => {
    if (tab) {
      const activeTab = tabs.find(t => t.query === tab);
      const activeTabKey = tabs.findIndex(t => t.query === tab);
      if (activeTab) {
        return {
          component: activeTab.component,
          key: activeTabKey
        }
      }
    }
    return false;
  };
  return (
    <Tab
      tabs={tabs}
      tabActive={tabActive}
      clicked={clickHandler}
      ActiveComponent={ActiveComponent}
    />
  );
};

export default withRouter(AccountTab);
