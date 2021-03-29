import React, { useCallback, useState } from 'react';
import {
  DirectMessageDropDownMenuWrapper,
  MenuStyled,
} from '@view/shared/styles';
import { ClickAwayListener, IconButton, ListItemText } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { MenuItemStyled } from '../styles';
import { Dropdown } from '@view/shared/CustomDropdownMenu/styles';
import { useHistory, useRouteMatch } from 'react-router-dom';

const DirectMessageDropDownMenu = () => {
  const [isMenuOpen, openMenu] = useState<boolean>(false);
  const baseUrl = useRouteMatch().url;
  const history = useHistory();

  return (
    <ClickAwayListener onClickAway={() => openMenu(false)}>
      <DirectMessageDropDownMenuWrapper>
        <IconButton
          aria-controls='dm-dropdown-menu'
          aria-haspopup='true'
          onClick={() => openMenu(true)}
        >
          <ExpandMoreIcon />
        </IconButton>
        {isMenuOpen && (
          <Dropdown>
            <MenuItemStyled onClick={() => history.push(`${baseUrl}/info`)}>
              <ListItemText primary='Info about chat' />
            </MenuItemStyled>
            <MenuItemStyled>
              <ListItemText primary='Clear chat' />
            </MenuItemStyled>
          </Dropdown>
        )}
      </DirectMessageDropDownMenuWrapper>
    </ClickAwayListener>
  );
};

export default DirectMessageDropDownMenu;
