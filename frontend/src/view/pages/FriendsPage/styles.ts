import styled from 'styled-components'
import List from '@material-ui/core/List'
import SearchIcon from '@material-ui/icons/Search'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import Container from '@material-ui/core/Container'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'

export const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  max-width: 1000px;
  width: 100%;
`

export const UsersWrapper = styled.div`
  max-width: 500px;
  width: 100%;
  margin-right: 20px;

  @media (max-width: 1024px) {
    max-width: 400px;
  }
`

export const ContentWrapper = styled(Paper)`
  max-width: 450px;
  width: 100%;
  padding: 10px 15px;

  @media (max-width: 1024px) {
    max-width: 400px;
  }
`

export const ListStyled = styled(List)`
  position: relative;
  overflow: auto;
  height: calc(100vh - 220px);
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

export const SearchInput = styled.input`
  border: none;
  outline: none;
  height: 40px;
  font-size: 16px;
  width: calc(100% - 50px);
`

export const FriendsTitleWrapper = styled.div`
  height: 42px;
  display: flex;
  align-items: center;
  padding-left: 10px;
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
  text-transform: capitalize;
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
  cursor: pointer;
`

export const AvatarStyled = styled(Avatar)`
  && {
    background: #bdbdbd;
  }
`