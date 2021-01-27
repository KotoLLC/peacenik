import styled from 'styled-components'
import SearchIcon from '@material-ui/icons/Search'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import Container from '@material-ui/core/Container'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import { Link } from 'react-router-dom'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import { ButtonOutlined, ButtonContained } from '@view/shared/styles'

export const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  max-width: 1000px;
  width: 100%;
  padding-bottom: 60px;
  
  @media (max-width: 600px) {
    padding: 15px 15px 60px;
  }
`

export const UsersWrapper = styled.div`
  max-width: 500px;
  width: 100%;

  @media (max-width: 600px) {
    max-width: 100%;
  }
`

export const ContentWrapper = styled(Paper)`
  max-width: 450px;
  width: 100%;
  padding: 10px 15px;

  @media (max-width: 600px) {
    max-width: 100%;
  }
`

export const ListStyled = styled.div`
  position: relative;
  overflow: auto;
  height: calc(100vh - 40px);
`

export const SearchWrapper = styled.div`
  background: #fff;
  width: 100%;
  height: 42px;
  display: flex;
  align-items: center;
  border-radius: 4px 4px 0 0;
  border-bottom: 1px solid #000;
`

export const SearchIconStyled = styled(SearchIcon)`
  margin-left: 15px;
  margin-right: 10px;
`

export const FriendsTitleWrapper = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
`

export const FriendsTitle = styled.div`
  display: flex;
  align-items: center;
`

export const ContainerTitle = styled.h3`
  font-size: 14px;
  padding: 5px 10px;
  margin: 0;
  text-transform: uppercase;
`

export const EmptyMessage = styled.div`
  padding: 15px;
  width: 100%;
  display: flex;
  line-height: center;
  align-content: center;
`

export const UserNoteUnderlined = styled.span`
  text-decoration: underline;
  text-transform: capitalize;
  color: #1976d2;
  cursor: pointer;
`
export const UserName = styled.span`
  /* text-transform: capitalize; */
`

export const UserNameLink = styled(Link)`
  cursor: pointer;
  /* text-transform: capitalize; */
  color: #000;

  &:hover {
    text-decoration: none;
  }
`

export const IconButtonGreen = styled(IconButton)`
  && {
    color: #1fc456;
  }
`

export const LinkWrapper = styled.div`
  text-align: center;
  margin-top: 10px;
  width: 100%;
`

export const ContainerStyled = styled(Container)`
  && {
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    margin-top: 100px;
  }
`

export const FormWrapper = styled.form`
  width: 350px;
  margin: 0 auto;
`

export const FormControlStyled = styled(FormControl)`
  && {
    margin: 0 0 15px; 
    width: 100%;
  }
`

export const ButtonStyled = styled(Button)`
  && {
    height: 42px;
    min-width: 150px;
  }
`

export const TitleWrapper = styled.div`
  text-align: center;
  margin-bottom: 20px;
`

export const ListItemWrapper = styled.div`
`

export const FriendsWrapper = styled.div`
  position: relative;
  width: 750px;
  min-height: 700px;
  padding: 15px 30px;
  background: #FFFFFF;
  margin: 0 auto 31px auto;

  @media (max-width: 760px) {
    width: 100%;
    padding: 15px 0 0 0;
    height: initial;
  }
`

export const FriendsTabsWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  height: 39px;
  justify-content: space-between;
`

export const FriendsTabs = styled(Tabs)`
  display: flex;
  width: 500px;

  .MuiTabs-indicator {
    background: #599C0B;
  }

  @media (max-width: 760px) {
    width: 100%;
  }
`

export const FriendsTab = styled(Tab)`
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
    font-family: SFUITextMedium;
    opacity: 0.5;
    transition: all 0.2s;
    color: #88909D;
  }

  
  &.Mui-selected {
    font-weight: 600;
    color: #599C0B;
    font-family: SFUITextBold;
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

export const SearchInputWrapper = styled.div`
  @media (max-width: 760px) {
    padding: 0 15px;
  }
`

export const SearchInput = styled(OutlinedInput)`
  &.MuiOutlinedInput-root {
    margin-top: 21px;
    width: 100%;
    background: rgba(161, 174, 200, 0.1);
    border-radius: 4px;
    height: 40px;
    opacity: 0.4;

    @media (max-width: 760px) {
      margin-bottom: 10px;
    }

    &:hover fieldset {
      border: 1px solid #C8CFD4;
    }

    &.Mui-focused {
      opacity: 1;
    }

    &.Mui-focused fieldset {
      border: 1px solid #C8CFD4;
    }
  }

  & .MuiInputAdornment-root {
    svg {
      color: #A1AEC8;
    }
  }
`

export const FriendCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  border-bottom: 1px solid rgba(200,207,212,0.6);

  @media (max-width: 760px) {
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

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
`

export const UserInfoText = styled.div`
  display: flex;
  flex-direction: column;
`

export const UserInfoDisplayName = styled(Link)`
  width: 100%;
  max-width: 300px;
  display: block;
  font-family: SFUITextMedium;
  font-size: 18px;
  line-height: 21px;
  color: #262626;
  text-decoration: none;
  margin-bottom: 10px;
  text-overflow: ellipsis;
  overflow: hidden; 
  white-space: nowrap;


  @media (max-width: 760px) {
    font-size: 16px;
    line-height: 19px;
    margin-bottom: 8px;
  }
`

export const UserInfoDisplayEmail = styled.span`
  font-family: SFUITextRegular;
  display: block;
  font-size: 16px;
  line-height: 19px;
  color: #ABB7CD;

  @media (max-width: 760px) {
    font-size: 14px;
    line-height: 16px;
  }
`

export const AvatarStyled = styled(Avatar)`
  && {
    width: 60px;
    height: 60px;
    margin-right: 20px;
    background: #DEE5F2;
    cursor: pointer;

    @media (max-width: 760px) {
      width: 50px;
      height: 50px;
      margin-right: 12px;
    }

    &.no-link {
      cursor: default;
    }
  }
`

export const ButtonGroup = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: space-between;
  min-width: 290px;

  span:last-child {
    margin: 0;
  }

  @media (max-width: 760px) {
    margin-top: 15px;
  }
`

export const FriendsButtonOutlined = styled(ButtonOutlined)`
  min-width: 140px;
`
export const FriendsButtonContained = styled(ButtonContained)`
  min-width: 140px;
`

export const FriendsEmpty = styled.div`
  width: 100%;
`

export const FriendsEmptyWrapper = styled.div`
  margin: 80px auto 0 auto;
  padding: 28px 0 0 0;
  width: 415px;
  height: 289px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 760px) {
    margin: 100px auto 0 auto;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 0;
    height: initial;
  }

`

export const IconWrapper = styled.div`
  width: 196px;
  height: 196px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 35px;
  background: #FFFFFF;
  box-shadow: 0px 1px 10px 2px rgba(216, 216, 216, 0.3);
  border-radius: 38px;

  svg {
    width: 110px;
    height: 110px;
    color: #C8CFD4;
  }

  @media (max-width: 760px) {
    width: 157px;
    height: 158px;
    margin-bottom: 21px;
    svg {
      width: 87px;
      height: 88px;
    }
  }
`

export const Text = styled.div`
  font-size: 18px;
  line-height: 27px;
  font-family: 'SFUITextRegular';
  width: 100%;
  text-align: center;

  @media (max-width: 760px) {
    font-size: 16px;
  }
`

export const TextUnderlined = styled.span`
  color: #599C0B;
  text-decoration: none;
  border-bottom: 1px solid #599C0B;
  transition: all 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    border-bottom: transparent;
  }
`