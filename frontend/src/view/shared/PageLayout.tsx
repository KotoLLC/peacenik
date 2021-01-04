import React from 'react'
import { PageWrapper } from './styles'
import TopBar from './TopBar'
import selectors from '@selectors/index'
import { connect } from 'react-redux'
import { BottomBar } from './BottomBar'

interface Props {
  isLogged: boolean
  isEmailConfirmed: boolean
}

export const WithPageLayout: React.SFC<Props> = (props) => {
  const {isLogged, isEmailConfirmed} = props  

  return (
    <PageWrapper>
      {isLogged && isEmailConfirmed && <TopBar/>}
      {props.children}
      {isLogged && isEmailConfirmed && <BottomBar/>}
    </PageWrapper>
  )
}

type StateProps = Pick<Props, 'isLogged' | 'isEmailConfirmed'>
const mapStateToProps = (state): StateProps => ({
  isLogged: selectors.authorization.isLogged(state),
  isEmailConfirmed: selectors.profile.isEmailConfirmed(state) || false,
})

export const PageLayout = connect(mapStateToProps)(WithPageLayout)