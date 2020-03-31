import React, {useContext, useEffect, useState} from 'react';
import dynamic from "next/dynamic";
import Layout from '../../layout/Layout';
import {withRouter, useRouter} from 'next/router';
import FirebaseContext from '../../firebase/context';
import TabNav from '../../components/UI/Tab/TabNav/TabNav';
import TabContent from '../../components/UI/Tab/TabContent/TabContent';

const Profile = dynamic(() => import('../../components/Account/Profile/Profile'), {
  ssr: false,
  loading: () => <p>Loading...</p>
});

const Offers = dynamic(() => import('../../components/Account/Offers/Offers'), {
  ssr: false,
  loading: () => <p>Loading...</p>
});

const Index = ({router}) => {

  const {loading, user} = useContext(FirebaseContext);

  const tabs = [
    {
      title: 'Mon Profil',
      query: 'Profile',
      component: Profile,
    },
    {
      title: 'Mes annonces',
      query: 'Offers',
      component: Offers,
    }
  ];

  const [tabActive, setTabActive] = useState(0);

  const [ActiveComponent, setActiveComponent] = useState(tabs[tabActive].component);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/connexion');
    }
  }, [user, loading]);

  useEffect(() => {
    const tab = router.query.tab;
    const activeTab = getTab(tab);
    console.log('activeTab', activeTab);
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
      console.log('activeTab', activeTab);
      const activeTabKey = tabs.findIndex(t => t.query === tab);
      console.log('activeTabKey', activeTabKey);
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
    <Layout
      title="Mon compte - Le site du don"
      description="Mon compte - Le site du don">

      {!!user &&
        <div>
          <h1>Mon compte</h1>
          
          <TabNav
            tabs={tabs}
            tabActive={tabActive}
            clicked={clickHandler} />
          <TabContent>
            <ActiveComponent />
          </TabContent>

        </div>
      }

    </Layout>
  );
};

export default withRouter(Index);
