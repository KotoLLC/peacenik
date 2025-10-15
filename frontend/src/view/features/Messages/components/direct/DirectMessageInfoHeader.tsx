import React, { useCallback } from 'react';
import { useHistory } from 'react-router';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { DMInHeaderWrapper, TitleSection } from '../styles';
import { ButtonContainedStyled } from '../MesssageSidebar';

const DirectMessageInfoHeader = () => {
  const history = useHistory();
  const handleCloseBtnClick = useCallback(() => {
    history.goBack();
  }, [history]);
  return (
    <DMInHeaderWrapper>
      <div>
        <IconButton onClick={() => handleCloseBtnClick()}>
          <CloseIcon />
        </IconButton>
        <TitleSection>Info about chat</TitleSection>
      </div>
      <ButtonContainedStyled>Save</ButtonContainedStyled>
    </DMInHeaderWrapper>
  );
};

export default DirectMessageInfoHeader;
