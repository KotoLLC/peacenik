import styled from 'styled-components'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import { NavLink, Link } from 'react-router-dom'

export const GroupsContainer = styled.main`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  width: 1140px;
  margin: 50px auto 0;
  padding-top: 30px;
`

export const PaperStyled = styled(Paper)`
  padding: 15px;
  position: relative;
  
  @media (max-width: 600px) {}
`

export const PageTitle = styled.h3`
  font-size: 18px;
  margin: 0 0 15px;
`

export const GroupPublicity = styled.div`
  width: 100%;
`

export const FormWrapper = styled.div`
  max-width: 430px;
  width: 100%;
  margin: 0 auto;
`

export const TextFieldStyled = styled(TextField)`
  width: 100%;
  margin-bottom: 15px;
`

export const FormControlStyled = styled(FormControl)`
  margin-bottom: 10px;
`

export const FormButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const FormButton = styled(Button)`
  margin-left: 15px;
  min-width: 100px;
`

export const GroupDetailsWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const RightButton = styled(Button)`
  margin-left: auto;  
`

export const UsersListWrapper = styled.div`
  max-width: 500px;
  width: 100%;
`

export const ListTitle = styled.h4`
  margin-bottom: 5px;
  padding-left: 16px;
`

export const SidebarWrapper = styled.ul`
  padding: 0;
  margin: 0;
  width: 262px;
  background: #fff;  
  position: sticky;
  left: 0;
  top: 94px;
  box-shadow: 0px 1px 3px #D4D4D4;
`

export const SidebarItem = styled(NavLink)`
  height: 55px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(190, 196, 204, 0.5);
  text-transform: uppercase;
  cursor: pointer;
  position: relative;
  text-decoration: none;
  font-size: 12px;
  font-weight: 700;
  font-family: 'SFUITextBold';
  color: #88909D;
  transition: 0.15s;

  &.active {
    color: #262626;

    &:before {
      display: inline-block;
      width: 4px;
      height: 44px;
      border-radius: 10px;
      background: #599C0B;
      position: absolute;
      left: 0;
      top: 5px;
      content: '';
    }
  }

  &:hover {
    color: #262626;
    
  }
`

export const SidebarButtonWrapper = styled.li`
  list-style: none;
  padding: 20px;
`

export const SidebarButton = styled(Link)`
  display: inline-block;
  height: 30px;
  line-height: 30px;
  width: 100%;
  background: #599C0B;
  border-radius: 15px;
  font-size: 13px;
  text-align: center;
  text-decoration: none;
  font-family: 'SFUITextMedium';
  color: #fff;
  cursor: pointer;
  font-size: 13px;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    background: #4e8c07;
  }
`

export const GroupsListWrapper = styled.div`
  width: 880px;
  display: flex;
  flex-wrap: wrap;
`

export const EmptyGroups = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  align-content: center;
  width: calc(100% - 30px);
  height: calc(100vh - 270px);
  margin-left: 30px;
  background: #E8EDF3;
`

export const EmptyGroupsText = styled.p`
  display: inline-block;
  font-size: 18px;
  max-width: 415px;
`

export const EmptyGroupsTextWrapper = styled.div`
  text-align: center;
  width: 100%;
  /* font-family: 'SFUITextLight'; */
`

export const EmptyGroupsTextLink = styled(Link)`
  color: #599C0B;
`

export const EmptyGroupsIconWrapper = styled.figure`
  width: 196px;
  height: 196px;
  background: #FFFFFF;
  box-shadow: 0px 1px 4px 2px rgba(216, 216, 216, 0.2);
  border-radius: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 38px;

  .groug-icon {
    fill: #C8CFD4;
  }

  .icon {
    width: 108px;
    height: 108px;
  }
`