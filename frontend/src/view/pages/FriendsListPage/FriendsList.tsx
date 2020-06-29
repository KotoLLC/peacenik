import React from 'react'
import {
  PageWrapper,
  Header,
  SidebarWrapper,
  ContentWrapper,
  ListStyled,
  SearchWrapper,
  SearchIconStyled,
  ContainerTitle,
} from './styles'
import { Tabs } from './Tabs'
import TopBar from '@view/shared/TopBar'
import ListItem from '@material-ui/core/ListItem'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'

export class FriendsList extends React.Component {

  mapFriendOfFriends = () => {
    return (
      <>
        <ContainerTitle>Remy Sharp`s common friends</ContainerTitle>
        <Divider />
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar alt="User Name" />
            </ListItemAvatar>
            <ListItemText
              primary="User Name"
              secondary={null}
            />
          </ListItem>
        </List>
      </>
    )
  }

  render() {
    return (
      <PageWrapper>
        <TopBar/>
        <Header>
          <Tabs />
        </Header>
        <SidebarWrapper>
          <Paper>
            <SearchWrapper>
              <FormControl fullWidth>
                <Input
                  id="filter"
                  placeholder="Filter"
                  startAdornment={<InputAdornment position="start"><SearchIconStyled /></InputAdornment>}
                />
              </FormControl>
            </SearchWrapper>
            <ListStyled>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" />
                </ListItemAvatar>
                <ListItemText
                  primary={<>User Name</>}
                  secondary={<>You have 2 friends in common</>}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </ListStyled>
          </Paper>
        </SidebarWrapper>
        <ContentWrapper>
          {this.mapFriendOfFriends()}
        </ContentWrapper>
      </PageWrapper>
    )
  }
}