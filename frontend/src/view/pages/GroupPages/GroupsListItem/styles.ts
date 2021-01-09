import styled from 'styled-components'
import Avatar from '@material-ui/core/Avatar'

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
  background-color: #ccc;
`

export const ItemContentWraper = styled.div`
  padding: 10px 16px 16px;
`

export const ItemHeader = styled.header`
  display: flex;
  justify-content: flex-end;
  position: relative;
`

export const ButtonContained = styled.span`
  display: inline-block;
  width: 105px;
  height: 26px;
  background: #599C0B;
  border-radius: 13px;
  font-family: 'SFUITextMedium';
  text-align: center;
  color: #fff;
  line-height: 26px;
  font-size: 12px;
  transition: 0.15s;
  cursor: pointer;

  &:hover {
    background: #4e8c07;
  }
`

export const ButtonOutlined = styled.span`
  display: inline-block;
  width: 105px;
  height: 26px;
  background: #fff;
  border-radius: 13px;
  font-family: 'SFUITextMedium';
  text-align: center;
  border: 1px solid #599C0B;
  color: ${props => props.color ? props.color : '#599C0B'};
  border-color: ${props => props.color ? props.color : '#599C0B'};
  line-height: 26px;
  font-size: 12px;
  transition: 0.15s;
  cursor: pointer;
`

export const AvatarStyled = styled(Avatar)`
  
  && {
    width: 62px;
    height: 62px;
    border: 3px solid #FFFFFF;
    position: absolute;
    left: 0;
    top: -41px;
  }
`

export const GroupName = styled.h3`
  color: #262626;
  font-family: 'SFUITextSemibold';
  margin: 5px 0;
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