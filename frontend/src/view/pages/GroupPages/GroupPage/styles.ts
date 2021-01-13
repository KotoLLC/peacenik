import styled from 'styled-components'
import Avatar from '@material-ui/core/Avatar'
import { Link } from 'react-router-dom'
import { ButtonOutlined } from '@view/shared/styles'

export const GroupCover = styled.div`
  width: 100%;
  height: 333px;
  margin-top: 60px;
  background-position: center;
  background-size: cover;
  background-color: #A1AEC8;
` 

export const GroupHeader = styled.header`
  width: 100%;
  background: #FFFFFF;
  box-shadow: 0px 1px 3px #D4D4D4;
`

export const GroupContainer = styled.div`
  width: 1140px;
  margin: 0 auto;
`

export const HeaderContainer = styled.div`
  width: 1140px;
  margin: 0 auto;
  min-height: 66px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const CountersWrapper = styled.div`
  margin-left: 290px;
  display: flex;
  align-items: center;
`

export const HeaderCounterWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: flex-start;
  justify-content: center;
  text-align: center;

  &:first-child {
    margin-right: 45px;
    position: relative;

    &:after {
      display: inline-block;
      position: absolute;
      right: -29px;
      top: calc(50% - 4px);
      content: '';
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #ABB7CD;
    }
  }
`

export const HeaderCounter = styled.span`
  width: 100%;
  color: #A1AEC8;
  font-size: 20px;
  font-family: 'SFUITextBold';
`

export const HeaderCounterName = styled.span`
  width: 100%;
  font-size: 12px;
  text-transform: uppercase;
  font-family: 'SFUITextMedium';
  margin-bottom: 2px;
`

export const LeftSideBar = styled.aside`
  width: 260px;
  margin-right: 30px;
  text-align: center;
`

export const RightSideBar = styled.aside`
  position: relative;
  padding: 20px 0 30px;
  width: 260px;
  margin-left: 30px;
  background: #fff;
  border-radius: 0 0 4px 4px;
`

export const CentralBar = styled.section`
  background: #fff;
  flex-grow: 1;
  padding: 20px 0 30px;
  position: relative;
  border-radius: 0 0 4px 4px;
`

export const ViewMoreButton = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  cursor: pointer;
  color: #88909D;
  font-size: 12px;
  font-family: 'SFUITextMedium';
  text-align: center;
  height: 30px;
  line-height: 30px;
  background: #EDF1F2;
  transition: 0.2s;
  border-radius: 0 0 4px 4px;

  &:hover {
    background: #dee2e3;
  }
`

export const BarTitle = styled.div`
  padding: 0 20px 5px;
  color: #000;
`

export const GroupMainWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  align-content: flex-start;
  justify-content: space-between;
  padding-top: 30px;
`

export const AvatarStyled = styled(Avatar)`
  width: 200px;
  height: 200px;
  background: #DEE5F2;
  margin: -160px auto 30px;
  border: 6px solid #FFFFFF;

  img {
    width: 50px;
  }
`

export const GroupName = styled.h2`
  font-size: 24px;
  margin-bottom: 16px;
  font-family: 'SFUITextMedium';
`

export const GroupPublicity = styled.p`
  font-size: 18px;
  margin-bottom: 30px;
  color:  #788692;
`

export const GroupDescriptopn = styled.div`
  padding-top: 30px;
  position: relative;

  &:before {
    content: '';
    display: inline-block;
    position: absolute;
    right: 0;
    top: 0;
    height: 1px;
    width: 50%;
    background: linear-gradient(90deg, rgba(247, 248, 249, 0.0001) 0%, #BEC4CC 59.24%);
    transform: rotate(-180deg);
  }
  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    display: inline-block;
    height: 1px;
    width: 50%;
    background: linear-gradient(90deg, rgba(247, 248, 249, 0.0001) 0%, #BEC4CC 59.24%);
    transform: matrix(1, 0, 0, -1, 0, 0);
  }
`

export const DangerZoneWrapper = styled.div`
  margin-top: 50px;
  padding: 20px 16px;
  background: #fff;
  text-align: left;
`

export const DangerZoneTitle = styled.h3`
  font-size: 16px;
  font-weight: normal;
  margin-bottom: 20px;
`

export const GroupMemberWrapper = styled.li`
  display: flex;
  align-items: center;
  min-height: 87px;
  padding: 15px 20px;
  background: #fff;
  border-bottom: 1px solid rgba(200, 207, 212, 0.6);

  &:last-child {
    border: none;
  }

  &.potential {
    padding: 15px;
  }
`

export const MemberAvatar = styled(Avatar)`
  width: 56px;
  height: 56px;
  background: #DEE5F2;
  margin-right: 16px;

  &.potential {
    height: 40px;
    width: 40px;
  }
`

export const MemberName = styled(Link)`
  text-decoration: none;
  font-family: 'SFUITextMedium';
  color: #000;

  &.potential {
    font-size: 14px;
    margin-bottom: 10px;
    display: block;
  }
`

export const MemberNameWrapper = styled.div`

`

export const MemberButtonOutlined = styled(ButtonOutlined)`
  margin-left: auto;
`

export const TopBarButtonOutlined = styled(ButtonOutlined)`
  width: 162px;
`