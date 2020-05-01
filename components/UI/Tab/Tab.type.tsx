import React from "react";

export interface TabType {
  title: string;
  query: string;
  component: React.ComponentType;
}

export interface TabProps {
  tabs: TabType[];
  tabActive: number;
  clicked: (event: number) => void;
  ActiveComponent: React.ComponentType;
}

export interface TabNavProps {
  tabs: TabType[];
  tabActive: number;
  clicked: (event: number) => void;
}

export interface TabReference {
  key: number;
  component: React.ComponentType;
}
