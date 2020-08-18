import React from 'react'
import { PageWrapper } from './styles'
import TopBar from './TopBar'
import selectors from '@selectors/index'
import { connect } from 'react-redux'

interface Props {
  isLogged: boolean
  isEmailConfirmed: boolean
}

export const TopBarComponent: React.SFC<Props> = (props) => {
  const {isLogged, isEmailConfirmed} = props  

  return (
    <PageWrapper>
      {isLogged && isEmailConfirmed && <TopBar/>}
      {props.children}
    </PageWrapper>
  )
}

type StateProps = Pick<Props, 'isLogged' | 'isEmailConfirmed'>
const mapStateToProps = (state): StateProps => ({
  isLogged: selectors.authorization.isLogged(state),
  isEmailConfirmed: selectors.profile.isEmailConfirmed(state) || false,
})

export const WithTopBar = connect(mapStateToProps)(TopBarComponent)