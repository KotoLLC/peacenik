import React, { useState } from 'react'
import ReactPageScroller from 'react-page-scroller'
import Typography from '@material-ui/core/Typography'
import { v4 as uuidv4 } from 'uuid'
import { withRouter, RouteComponentProps } from 'react-router'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Button from '@material-ui/core/Button'

import {
  BuleetsWrapper,
  Bullet,
  ContainerStyled,
  GoBackButton,
} from './styles'

export const AboutUs: React.SFC<RouteComponentProps> = (props) => {
  const [currentPage, handlePageChange] = useState(0)

  const getPagesBullets = () => {
    const countOfBullets = 3 // set count of bullets here
    const bullets: JSX.Element[] = []

    for (let i = 1; i <= countOfBullets; i++) {
      bullets.push(
        <Bullet
          key={uuidv4()}
          className={((i - 1) === currentPage) ? 'active' : ''}
          onClick={() => handlePageChange(i - 1)}
        />
      )
    }

    return [...bullets]
  }

  return (
    <>
      <ReactPageScroller
        pageOnChange={handlePageChange}
        customPageNumber={currentPage}
      >
        {/* slide */}
        <ContainerStyled maxWidth="md">
          <div>
            <Typography variant="h3" gutterBottom>Description Koto</Typography>
            <Typography variant="subtitle1" gutterBottom>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur</Typography>
          </div>
        </ContainerStyled>

        {/* slide */}
        <ContainerStyled maxWidth="md">
          <div>
            <Typography variant="h3" gutterBottom>Some image</Typography>
            <LazyLoadImage
              alt="img"
              effect="blur"
              src="https://picsum.photos/id/10/400/300" />
            <Typography variant="subtitle1" gutterBottom>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur</Typography>
          </div>
        </ContainerStyled>

        {/* slide */}
        <ContainerStyled maxWidth="md">
          <div>
            <Typography variant="h3" gutterBottom>Create node</Typography>
            <Button variant="contained" color="primary" onClick={() => props.history.push('/nodes/create')}>create</Button>
          </div>
        </ContainerStyled>

      </ReactPageScroller>
      <BuleetsWrapper>{getPagesBullets()}</BuleetsWrapper>
      <GoBackButton onClick={props.history.goBack} variant="contained" color="primary">go back</GoBackButton>
    </>
  )
}

export default withRouter(AboutUs)