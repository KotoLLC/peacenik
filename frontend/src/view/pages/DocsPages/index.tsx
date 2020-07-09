import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { CodeOfConductPage } from './CodeOfConductPage'
import { withRouter, RouteComponentProps } from 'react-router'
import Container from '@material-ui/core/Container'
import {
  PaperStyled,
  DocWrapper,
  GoBackButton,
} from './styles'

const DocsPages: React.SFC<RouteComponentProps> = (props) => {

  return (
    <DocWrapper>
      <Container maxWidth="lg">
        <PaperStyled>
          <Switch>
            <Route path="/docs/code-of-conduct" exact component={CodeOfConductPage} />
          </Switch>
          <GoBackButton onClick={props.history.goBack} variant="contained" color="primary">go back</GoBackButton>
        </PaperStyled>
      </Container>
    </DocWrapper>
  )
}

export default withRouter(DocsPages)