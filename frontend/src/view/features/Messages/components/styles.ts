import styled from 'styled-components'
import { Link, NavLink } from 'react-router-dom'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Avatar from '@material-ui/core/Avatar'
import { IconWrapper } from '@view/shared/styles'
import { MessageDirection, MessageInfoTextStatus } from '../types/types'
import MenuItem from '@material-ui/core/MenuItem'
import { Checkbox } from '@material-ui/core'


export const MessagesWrapper = styled.div`
  position: relative;
  width: 1140px;
  height: 820px;
  background: #FFFFFF;
  margin: 0 auto 31px auto;
  display: flex;
  box-shadow: 2px 2px 2px #888888;

  @media (max-width: 770px) {
    width: calc(100% - 30px);
    padding: 15px 0 0 0;
    min-height: calc(100vh - 100px);
  }
`

export const ContentWrapper = styled.div`
  flex: 1 0 auto;
  background: #e8edf3;
`

export const InfoBlockIconWrapper = styled.div`
  height: 22px;  
  width: 22px;  
  margin-right: 25px;
  &.mute {
    svg {
      font-size: 1.5rem;
    }
  }
`;

export const InfoContentSettingTitle = styled.div`
  display:flex;
  align-items: center;
`;

export const SendOutlineWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
export const AvatarWrapperLink = styled(Link)`
  border-radius: 50%;
  overflow: hidden;
  background: #bdbdbd;
  width: 42px;
  height: 42px;
  flex-shrink: 0;

  &.small {
    width: 40px;
    height: 40px;

    .MuiAvatar-fallback,
    .MuiAvatar-root {
      width: 100%;
      height: 100%;
    }
  }

  @media (max-width: 770px) {
    width: 36px;
    height: 36px;

    &.small {
      width: 30px;
      height: 30px;
    }
  }

  /* .MuiAvatar-root {
    width: 50px !important;
    height: 50px !important;
  } */
`

export const UserAvatarStyled = styled(Avatar)`
  && {
    /* margin-right: 16px; */
    background: #bdbdbd;
    width: 42px;
    height: 42px;

    @media (max-width: 770px) {
      width: 36px;
      height: 36px;
    }
  }
`
export const ContactAvatarStyled = styled(Avatar)`
  && {
    /* margin-right: 16px; */
    background: #bdbdbd;
    width: 45px;
    height: 45px;

    @media (max-width: 770px) {
      width: 36px;
      height: 36px;
    }
  }
`
export const UserNameLink = styled(Link)`
  font-family: 'SFUITextMedium';
  font-size: 18px;
  margin-left: 16px;
  color: #000;

  @media (max-width: 770px){
    font-size: 16px;
    margin-left: 10px;
  }

  @media (max-width: 600px) {
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 130px;
  }
`
export const InfoUserNameLink = styled(UserNameLink)`
  margin: 0px;
  font-size: 22px;
`
export const InfoUserLastAccess = styled.div`
  font-size: 22px;
  color: #a1aec8;
  padding: 5px;
`



export const MessageInfo = styled.div`
  display: flex;
  align-items: center;
  max-width: 250px;
  min-width: 250px;
  width: 250px;
`;

export const SidebarWrapper = styled.div`
  width: 460px;
  z-index: 1;
  top: 0;
  left: 0;
  overflow-x: hidden;
  padding: 0;
  height: 100%;  
  position: relative;
  height: 820px;
  .huxzai {
    margin-bottom: 20px;
  }
  
`;
export const SidebarHeader = styled.div`
  display: flex;
  padding: 20px;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  box-shadow: 1px 1px 3px 1px #d4d4d4;
`;
export const SidebarContent = styled.div`
  height: 100%;
`;
export const SidebarFooter = styled.div`
    position: absolute;
    bottom: 30px;
    transform: translateX(-50%);
    left: 50%;
`;

export const ListTabs = styled(Tabs)`
  display: flex;
  width: 100%;

  .MuiTabs-indicator {
    background: #599C0B;
  }

  @media (max-width: 770px) {
    width: 100%;
  }
`

export const ListTab = styled(Tab)`
  && {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
    height: 100%;
    font-size: 14px;
    line-height: 16px;
    cursor: pointer;
    font-family: 'SFUITextMedium';
    opacity: 0.5;
    transition: all 0.2s;
    color: #88909D;
  }

  
  &.Mui-selected {
    font-weight: 600;
    color: #599C0B;
    font-family: 'SFUITextBold';
    opacity: 1;
  }

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    background: #C8CFD4;
    width: 100%;
    height: 2px;
  }
`
export const ListTabsWrapper = styled.div`
  display: flex;
  align-items: flex-end;    
  height: 54px;
`

export const MessageCardContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  
  border-bottom: 1px solid rgba(200,207,212,0.6);
  
  
  @media (max-width: 770px) {
    position: relative;
    flex-wrap: wrap;
    padding: 20px 5px;
    width: calc(100% - 10px);
    margin-left: auto;
    border: none;
  
    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      right: 0;
      background: rgba(200,207,212,0.6);
      width: calc(100% - 10px);
      height: 1px;
    }
  }
`;
export const MessageCard = styled.div`
  padding-left: 20px;
  &:hover {
    background-color: #599C0B20;    
  }
`
export const MessageInfoBlock = styled(Link)`
  display: flex;
  flex-direction: column;
  min-width: 380px;
  justify-content: space-between;
  padding-right: 20px;
  margin-left: 15px;
`

export const MessageInfoDisplayName = styled.div`
  width: 100%;
  max-width: 250px;
  display: block;
  font-family: 'SFUITextMedium';
  font-size: 18px;
  line-height: 21px;
  color: #262626;
  text-decoration: none;
  text-overflow: ellipsis;
  overflow: hidden; 
  white-space: nowrap;


  @media (max-width: 770px) {
    font-size: 16px;
    line-height: 19px;
    margin-bottom: 8px;
  }
`
export const MessagesListContent = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
`

export const MessageInfoHeader = styled.div`
  height: 20px;
  display:flex;
  justify-content: space-between;
`


export const MessageInfoContent = styled.div`
  height: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;  
  flex-direction: ${props => props && props['flex-direction'] !== 'reverse' ? 'row' : 'row-reverse'}
`

export const MessageInfoLastAccessTime = styled.span`
  font-size: 13px;
  color: #abb7cd;
`
interface MessageInfoTextProps {
  color: MessageInfoTextStatus | undefined 
}
export const MessageInfoText = styled.div<MessageInfoTextProps>`
  font-size: 14px;  
  width: 330px;
  color: ${props => props && props.color === MessageInfoTextStatus.HIGHLIGHT ? '#262626' : '#abb7cd'};
  font-weight: ${props => props && props.color === MessageInfoTextStatus.HIGHLIGHT ? 'bold' : 'normal'};
`
export const MessageMissedCount = styled.div`
  font-size: 14px;
  background-color: #599c0b;
  color: #ffffff;
  width: 20px;
  height: 20px;
  border-radius: 50%;  
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1ch;
}
`
export const StatusIconWrapper = styled(IconWrapper)`
  width: 16px;
  height: 16px;  
  margin: 0;
  svg {
    width: 16px;
    height: 16px;  
  }
}
`
export const StatusWrapper = styled.div`
  height: 100%;
`
export const DirectMessageWrapper = styled.div`
  
`
export const ContactUserInfo = styled.div`
  display: flex;

`
export const UserInfoBlock = styled.div`
  margin-left: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const UserInfoName = styled.div`
  font-family: 'SFUITextMedium';
  font-size: 18px;
  line-height: 21px;
  color: #262626;
`
export const UserInfoStatus = styled.div`
  color: #599c0b;
`

export const DirectMessageBoxWapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`
export const DMContentWrapper = styled.div`
  flex: 1 0 auto;
  overflow-y: auto;
  max-height: 660px;
`
export const DMContentInfoWrapper = styled.div`
  flex: 1 0 auto;
  overflow-y: auto;
  max-height: 760px;
`
export const DMInHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #ffffff;
  margin-left: 2px;
  padding: 15px 20px;
  box-shadow: 2px 2px 2px #cccccc;
  display: flex;
  align-items: center;
`
export const DMHeaderWrapper = styled.div`
  flex-shrink: 0;
  height: 86px;  
  margin-left: 1px;
`
export const DMFooterWapper = styled.div`
  flex-shrink: 0;
  height: 70px;
  background-color: #a1aec8;
  padding: 10px 20px;

`
export const DMInFooterWrapper = styled.div`
  display:flex;
  justify-content:space-between;
  align-item:center;  
`
  

export const MessageItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${p=>(p['justify-content']==MessageDirection.OUTGOING_MESSAGE)?'flex-end':'flex-start'};
  margin: 15px;  
`
export const MessageTextContent = styled.div`
  display: flex;
  max-width: 610px;
  padding: 10px 13px;
  border-radius: 13px;
  background-color: ${p=>p.color==MessageDirection.OUTGOING_MESSAGE?'#599c0b':'#fff'};
  color: ${p=>p.color==MessageDirection.OUTGOING_MESSAGE?'#fff':'#000'};
  flex-wrap: wrap;
  justify-content: flex-end;
  align-item: center;
`
export const MessageTextContentBody = styled.div`
  display: flex;
  margin-right: 10px;
`
export const MessageTransmissionTime = styled.span`
  color: ${p=>p.color==MessageDirection.OUTGOING_MESSAGE?'#eeeeee':'#a9acb5'};
  `
export const MessageDeliverStatus = styled.div`
  margin-left: 12px;
  width: 15px;
  height: 15px;
`
export const MessageTextContentFooter = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
`

export const MessageStatusIconWrapper = styled(IconWrapper)`
  width: 16px;
  height: 16px;  
  margin: 0;
  background: transparent;
  box-shadow: none;
  svg {
    width: 16px;
    height: 16px;  
  }
}
`

export const MessageImageContent = styled.div`
  max-width: 350px;
  padding: 5px;
  border-radius: 7px;
  background-color: ${p=>p.color==MessageDirection.OUTGOING_MESSAGE?'#599c0b':'#fff'};
  color: ${p=>p.color==MessageDirection.OUTGOING_MESSAGE?'#fff':'#000'};  
  position: relative;
`

export const MessageImageContentBody = styled.img`
  display: flex;
  margin-right: 10px;
  width: 100%;
  border-radius: 5px;
`
export const MessageImageContentFooter = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  position: absolute;
  right: 20px;
  bottom: 20px;  
  background-color: ${p=>p.color==MessageDirection.OUTGOING_MESSAGE?'#599c0bE0':'#ffffffE0'};
  padding: 0 4px;
  border-radius: 2px;
`

export const ComposeCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 20px 0px;
  border-bottom: 1px solid rgba(200,207,212,0.6);
  margin-left: 30px;
  &:hover {
    background-color: #599C0B20;    
    margin-left: 0px;
    padding-left: 30px;
    border-bottom: 1px solid #00000000;
  }

  @media (max-width: 770px) {
    position: relative;
    flex-wrap: wrap;
    padding: 20px 5px;
    width: calc(100% - 10px);
    margin-left: auto;
    border: none;

    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      right: 0;
      background: rgba(200,207,212,0.6);
      width: calc(100% - 10px);
      height: 1px;
    }
  }
`
export const AttachmentButton = styled.label`  
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;  
`
export const MenuItemStyled = styled(MenuItem)`
  min-width: 180px;
  padding: 15px 20px;
  z-index: 100;
  & span {
    font-weight: 600;    
  }
`
export const TitleSection = styled.span`
  font-weight: bold;
`;
export const InfoContentCommon = styled.div`
  border-top: 1px #d4dae0 solid;
  font-family: 'SFUITextMedium';
`
export const InfoContentHeader = styled.div`
  width: 100%;
  height: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
export const InfoContentBlock = styled(InfoContentCommon)`
  padding: 15px 0; 
`
export const InfoContentSettingBlock = styled(InfoContentCommon)`
  padding: 15px 0; 
  display: flex;
  align-items: center;
  justify-content: space-between;
`
export const InfoContentSubtitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
`
export const InfoContentGallery = styled.div`
  display:flex;
  max-width: 650px;
  overflow-y: auto;
`
export const InfoContentPhoto = styled.div`
  width: 120px;
  min-width: 120px;
  height: 120px;
  border-radius: 7px;
  margin-right: 5px;
  background-image: url(${p=>p['background-image']});
  background-size: cover;
  background-position: center;
`
export const InfoContentSinglePhoto = styled.div`
  display:flex;
`
export const InfoContentAvatarWrapper = styled.div`
  height: 250px;
  width: 250px;
  border-radius: 50%;
  overflow: hidden;
  background: #bdbdbd;
  flex-shrink: 0;
  margin: 10px;

  &.small {
    width: 40px;
    height: 40px;

    .MuiAvatar-fallback,
    .MuiAvatar-root {
      width: 100%;
      height: 100%;
    }
  }

  @media (max-width: 770px) {
    width: 36px;
    height: 36px;

    &.small {
      width: 30px;
      height: 30px;
    }
  }
  .MuiAvatar-fallback,
  .MuiAvatar-root {
    width: 100%;
    height: 100%;
  }
`;

export const InfoContentWrapper = styled.div`
  padding: 17px;
`
export const InfoContentCheckbox = styled(Checkbox)`
  padding: 0px;
`
