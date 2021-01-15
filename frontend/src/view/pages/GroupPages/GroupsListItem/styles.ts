import styled from 'styled-components'
import Avatar from '@material-ui/core/Avatar'
import { Link } from 'react-router-dom'

export const GroupsListItemWrapper = styled.div`
  width: 262px;
  background: #fff;
  position: relative;
  margin: 0 0 30px 30px;
`

export const ItemCover = styled.div`
  height: 80px;
  background-position: center;
  background-size: cover;
  background-color: #A1AEC8;
`

export const ItemContentWraper = styled.div`
  padding: 10px 16px 16px;
`

export const ItemHeader = styled.header`
  display: flex;
  justify-content: flex-end;
  position: relative;
`

export const AvatarStyled = styled(Avatar)`
  background: #DEE5F2;

  && {
    width: 62px;
    height: 62px;
    border: 3px solid #FFFFFF;
    position: absolute;
    left: 0;
    top: -41px;
  }

  img {
    width: 24px;
    height: 24px;
  }
`

export const GroupName = styled(Link)`
  display: inline-block;
  color: #262626;
  font-family: 'SFUITextSemibold';
  margin: 5px 0;
  text-decoration: none;
`

export const GroupCounter = styled.div`
  color: #788692;
  font-size: 14px;
  font-family: 'SFUITextLight';
`

export const GroupPublicity = styled.span`
  display: block;
  color: #788692;
  font-size: 12px;
  font-family: 'SFUITextBold';
  margin: 10px 0 0px;
`

export const GroupDescription = styled.p`
  font-size: 14px;
  font-family: 'SFUITextLight';
  height: 60px;
  margin: 10px 0 0;
  overflow: hidden;
`