import React, {useEffect, useState} from 'react';
import { Router, withRouter } from "next/router";
import dynamic, { DynamicOptions } from "next/dynamic";
import Spinner from '../../UI/Spinner/Spinner';
import { TabReference, TabType } from "../../UI/Tab/Tab.type";
import Tab from "../../UI/Tab/Tab";

// ------------------ Dynamic import setup ------------------
const loadingComponent = (): JSX.Element => {
  return <Spinner small />;
};
// Avoid eslint issue 'Component definition is missing display name'
loadingComponent.displayName = 'LoadingComponent';

const dynamicOptions: DynamicOptions = {
  ssr: false,
  loading: loadingComponent,
};

const Profile = dynamic(() => import('../Profile/Profile'), dynamicOptions);
const Offers = dynamic(() => import('../Offers/Offers'), dynamicOptions);
const Conversations = dynamic(() => import('../Conversations/Conversations'), dynamicOptions);

interface AccountTabProps {
  router: Router;
}
const AccountTab: React.FC<AccountTabProps> = ({router}) => {

  // ------------------ Local vars ------------------
  const tabs: TabType[] = [
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

  // ------------------ State ------------------
  const [tabActive, setTabActive] = useState<number>(0);

  const [
    ActiveComponent,
    setActiveComponent
  ] = useState<React.ComponentType>(tabs[tabActive].component);

  // ------------------ Effects ------------------
  useEffect(() => {

    const getTabReference = (tab: string): TabReference | null => {
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
      return null;
    };

    let tab = router.query.tab;
    if (Array.isArray(tab)) {
      tab = tab[0];
    }
    const activeTab = getTabReference(tab);
    if (activeTab) {
      setTabActive(activeTab.key);
      setActiveComponent(activeTab.component);
    }
  }, [router, tabs]);

  const clickHandler = (index: number): void => {
    // change url without reloading
    const query = tabs[index].query;
    const href = `/compte?tab=${query}`;
    const as = href;
    router.push(href, as, {shallow: true});
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
