import styled from 'styled-components'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import FormControl from '@material-ui/core/FormControl'

export const ContainerStyled = styled(Container)`
  && {
    margin-top: 75px;
  }
`

export const ProfileWrapper = styled(Paper)`
  padding: 15px;
  min-height: 50vh;
  position: relative;
  padding-bottom: 80px;
`

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
` 

export const Title = styled.h3`
  font-size: 18px;
  margin: 0;
`

export const ContentWrapper = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: center;
`

export const AvatarWrapper = styled.div`
  width: 200px;
`

export const Avatart = styled.label`
  overflow: hidden;
  background: #ccc;  
  border-radius: 5px;
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  img {
    width: 100%;
  }
`

export const FormWrapper = styled.form`
  width: 300px;
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