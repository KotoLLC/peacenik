import styled from 'styled-components'
import { ButtonOutlined, ButtonContained } from '@view/shared/styles'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'

export const NoFriendsWrapper = styled.div`
  width: 196px;
  height: 196px;
  box-shadow: 0px 1px 10px 2px rgba(216, 216, 216, 0.3);
  border-radius: 38px;
  margin: 30px auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    color: #C8CFD4;
    font-size: 80px;
  }

  &.small-size {
    width: 124px;
    height: 124px;
    box-shadow: 0px 1px 10px 2px rgba(216, 216, 216, 0.3);
    border-radius: 24px;
    margin: 40px auto 0;

    svg {
      font-size: 50px;
    }
  }

  @media (max-width: 770px){
    width: 155px;
    height: 155px;
    box-shadow: 0px 1px 10px 2px rgba(216, 216, 216, 0.3);
    border-radius: 26px;

    svg {
      font-size: 65px;
    }

    &.small-size {
      width: 155px;
      height: 155px;
      box-shadow: 0px 1px 10px 2px rgba(216, 216, 216, 0.3);
      border-radius: 26px;
      
      svg {
        font-size: 65px;
      }
    }
  }
`

export const NoFriendsTitle = styled.h3`
  text-align: center;
  margin: 28px 0 50px;
  font-size: 18px;

  &.small-size {
    font-size: 16px;
    margin: 26px 0 80px;
  }

  @media (max-width: 770px){
    font-size: 16px;
    margin: 20px 0;

    &.small-size {
      font-size: 16px;
      margin: 20px 0;
    }
  }
`

export const ButtonOutlinedStyled = styled(ButtonOutlined)`
  margin-left: 10px;
  margin-right: 10px;

  @media (max-width: 770px) {
    margin-right: 0px;
    margin-top: 10px;
  }

  @media (max-width: 370px) {
    margin: 10px 5px 0;
  }
` 

export const ButtonContainedStyled = styled(ButtonContained)`
  margin-right: 10px;

  @media (max-width: 770px) {
    margin-top: 10px;
  }

  @media (max-width: 370px) {
    margin: 10px 5px 0;
  }
`

export const DotsIcon = styled(MoreHorizIcon)`
  color: #A1AEC8;
`

export const CoverBarDropdownWrapper = styled.div`
  display: inline-block;
  
  @media (max-width: 770px) {
    width: 100%;
  }
`