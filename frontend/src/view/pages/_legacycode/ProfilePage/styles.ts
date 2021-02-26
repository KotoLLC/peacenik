import styled from 'styled-components'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import FormControl from '@material-ui/core/FormControl'

export const ContainerStyled = styled(Container)`
  && {
    margin-top: 75px;
    padding-bottom: 30px;
  }
`

export const ProfileWrapper = styled(Paper)`
  padding: 15px;
  position: relative;
  padding-bottom: 60px;
  margin-bottom: 10px;
  
  @media (max-width: 600px) {
    padding-bottom: 40px;
  }
`

export const Header = styled.header`
  /* display: flex; */
  /* justify-content: space-between; */
  /* align-items: center; */
`

export const Title = styled.h3`
  font-size: 18px;
  margin: 0;
`

export const UserContentWrapper = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: center;
  
  &.user-profile {
    align-items: flex-end;
  }

  @media (max-width: 600px) {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
`

export const AvatarWrapper = styled.div`
  width: 180px;

  &.user-profile {
    margin-top: 0;
    width: 170px;
  }
`

export const AvatarLabel = styled.label`
  overflow: hidden;
  background: #ccc;  
  border-radius: 5px;
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 1px solid #ccc;

  &.no-link {
    cursor: default;
  }

  img {
    width: 100%;
  }
`

export const FormWrapper = styled.form`
  width: 300px;

  @media (max-width: 600px) {
    margin-top: 20px;
    max-width: 500px;
    width: 100%;
  }
`

export const FormControlStyled = styled(FormControl)`
  && {
    margin: 0 0 15px; 
    width: 100%;
  }
`

export const UserNameWrapper = styled.p`
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 18px;
`

export const UploadInput = styled.input`
  display: none;
`

export const FieldNote = styled.p`
  margin: 0 0 15px;
  color: #999;
`

export const UsersWrapper = styled.div`
  max-width: 500px;
  width: 100%;
  margin: 20px auto;

  @media (max-width: 600px) {
    max-width: 100%;
  }
`

export const UserMenuWrapper = styled.div`
  /* align-items: flex-end; */
`

export const NoCommonFriendsMessage = styled.p`
  text-align: center;
`

export const ProfileName = styled.h3`
  font-size: 16px;
  margin: 0;
`