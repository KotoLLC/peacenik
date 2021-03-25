import React, { useState } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";

import {
  ListTab,
  ListTabs,
  ListTabsWrapper,
} from "@view/features/Messages/components/styles";

export const MessagesListTab = () => {
  const [currentTab, onTabChange] = useState<number | boolean>(0);
  const baseUrl = useRouteMatch().path;
  const history = useHistory();
  return (
    <ListTabsWrapper>
      <ListTabs
        value={currentTab}
        onChange={(event, newTab) => onTabChange(newTab)}
        centered
      >
        <ListTab
          label="Direct Messages"
          onClick={() => history.push(`${baseUrl}/d`)}
        ></ListTab>
        <ListTab
          label="Group Messages"
          onClick={() => history.push(`${baseUrl}/g`)}
        ></ListTab>
      </ListTabs>
    </ListTabsWrapper>
  );
};
