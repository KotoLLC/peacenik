import styled from 'styled-components'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'

export const ContainerStyled = styled(Container)`
  && {
    margin-top: 75px;
  }
`

export const PaperStyled = styled(Paper)`
  padding: 15px;
  position: relative;
  
  @media (max-width: 600px) {
    /* padding-bottom: 40px; */
  }
`

export const PageTitle = styled.h3`
  font-size: 18px;
  margin: 0 0 15px;
`

export const MyGroupsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

export const GroupsList = styled.ul`
  max-width: 70%;
  padding: 0;
  margin: 0;
`

export const GroupsListItem = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }
`

export const ButtonsWrapper = styled.div`
  text-align: right;
  width: 200px;
`

export const ButtonStyled = styled(Button)`
  margin-bottom: 15px;
  min-width: 180px;
  text-decoration: none;
`

export const GroupAvatar = styled(Avatar)`
  width: 80px;
  height: 80px;
  margin-right: 15px;
  cursor: pointer;

  &.no-pointer {
    cursor: default;
  }
`

export const GroupName = styled.h4`
  width: 100%;
  margin: 0 0 5px;
  cursor: pointer;

  &.no-pointer {
    cursor: default;
  }
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