import React, {
  // MouseEventHandler,
  // useCallback,
  useEffect,
  // useState,
} from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { ApiTypes, StoreTypes } from 'src/types';
import { ModalDialog } from '@view/shared/ModalDialog';

import { getAvatarUrl } from '@services/avatarUrl';
import {
  AvatarStyled,
  ButtonGroup,
  FriendsButtonContained,
  UserInfo,
  UserInfoDisplayEmail,
  UserInfoDisplayName,
  UserInfoText,
} from '@view/features/Friends/components/styles';
import Actions from '@store/actions';
import { ComposeCard } from '../styles';

interface DirectMessageDialogProps {
  isOpenModal: boolean;
  setOpenDialog: (chk: boolean) => void;
  onChatOpen: (userId: string) => void;
  className?: string;
}

export const DirectMessageDialog: React.FC<DirectMessageDialogProps> = ({
  isOpenModal,
  className,
  setOpenDialog,
  onChatOpen,
}) => {
  const friends = useSelector<StoreTypes, ApiTypes.Friends.Friend[] | null>(
    (state) => state.friends.friends
  );
  const dispatch = useDispatch();

  // load friends
  useEffect(() => {
    dispatch(Actions.friends.getFriendsRequest());
  }, [dispatch]);

  return (
    <ModalDialog
      title='Compose'
      isModalOpen={isOpenModal}
      className={className}
      setOpenModal={() => setOpenDialog(!isOpenModal)}
    >
      {friends &&
        _.isArray(friends) &&
        friends.map((f) => (
          <ComposeCard key={f.user.id}>
            <UserInfo>
              <Link to={`/profile/user?id=${f.user.id}`}>
                <AvatarStyled
                  alt={f.user.full_name}
                  src={getAvatarUrl(f.user.id)}
                />
              </Link>
              <UserInfoText>
                <UserInfoDisplayName to={`/profile/user?id=${f.user.id}`}>
                  {f.user.full_name || f.user.name}
                </UserInfoDisplayName>
                <UserInfoDisplayEmail>@{f.user.name}</UserInfoDisplayEmail>
              </UserInfoText>
            </UserInfo>
            <ButtonGroup>
              <FriendsButtonContained onClick={() => onChatOpen(f.user.id)}>
                Send message
              </FriendsButtonContained>
            </ButtonGroup>
          </ComposeCard>
        ))}
    </ModalDialog>
  );
};
