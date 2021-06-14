import Avatar from '@material-ui/core/Avatar';
import { getAvatarUrl } from '@services/avatarUrl';
import React from 'react';
import {
  InfoContentAvatarWrapper,
  InfoContentGallery,
  InfoContentHeader,
  InfoContentPhoto,
  InfoContentBlock,
  InfoContentSubtitle,
  InfoContentWrapper,
  InfoUserLastAccess,
  InfoUserNameLink,
  InfoBlockIconWrapper,
  InfoContentSettingBlock,
  InfoContentSettingTitle,
  InfoContentCheckbox,
} from '../styles';

import VolumeMuteOutlinedIcon from '@material-ui/icons/VolumeMuteOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import BlockOutlinedIcon from '@material-ui/icons/BlockOutlined';

import { Checkbox } from '@material-ui/core';

const DirectMessageInfoContent = () => {
  // const senderId = useSelector((state) => state.message);
  const senderId = `123455`;
  const full_name = 'Ada Illiott';
  const last_login = 'today, 10:18 pm';
  const photos = [
    {
      id: '123123123',
      url: 'https://www.w3schools.com/html/pic_trulli.jpg',
    },
    {
      id: '1231231231',
      url: 'https://www.w3schools.com/html/img_chania.jpg',
    },
  ];
  return (
    <InfoContentWrapper>
      <InfoContentHeader>
        <InfoContentAvatarWrapper>
          <Avatar src={getAvatarUrl(senderId)} alt={full_name} />
        </InfoContentAvatarWrapper>
        <InfoUserNameLink to={`/profile/user?id=${senderId}`}>
          {full_name}
        </InfoUserNameLink>
        <InfoUserLastAccess>Last online: {last_login}</InfoUserLastAccess>
      </InfoContentHeader>
      <InfoContentBlock>
        <InfoContentSubtitle>Photo ({photos.length})</InfoContentSubtitle>
        <InfoContentGallery>
          {photos.map((p) => (
            <InfoContentPhoto key={p.id} background-image={p.url} />
          ))}
        </InfoContentGallery>
      </InfoContentBlock>

      <InfoContentSettingBlock>
        <InfoContentSettingTitle>
          <InfoBlockIconWrapper className='mute'>
            <VolumeMuteOutlinedIcon />
          </InfoBlockIconWrapper>
          Mute Chat
        </InfoContentSettingTitle>
        <InfoContentCheckbox
          checked={true}
        // onChange={handleChange}
        // inputProps={{ 'aria-label': 'primary checkbox' }}
        />
      </InfoContentSettingBlock>
      <InfoContentSettingBlock>
        <InfoContentSettingTitle>
          <InfoBlockIconWrapper>
            <BlockOutlinedIcon />
          </InfoBlockIconWrapper>
          Block contact
        </InfoContentSettingTitle>
      </InfoContentSettingBlock>
      <InfoContentSettingBlock>
        <InfoContentSettingTitle>
          <InfoBlockIconWrapper>
            <DeleteOutlineOutlinedIcon />
          </InfoBlockIconWrapper>
          Delete chat
        </InfoContentSettingTitle>
      </InfoContentSettingBlock>
    </InfoContentWrapper>
  );
};

export default DirectMessageInfoContent;
