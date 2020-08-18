import styled from 'styled-components'
import Container from '@material-ui/core/Container'

export const ContainerStyled = styled(Container)`
  && {
    padding-top: 100px;
    padding-bottom: 40px;
  }

  img {
    max-width: 100%;
  }
`
export const ImageDemo = styled.img`
  max-width: 600px;
  width: 100%;
`

export const SwipeNote = styled.div`
  display: none;
  position: fixed;
  left: 50%;
  bottom: 10px;
  transform: translate(-50%, 0);

  @media (max-width: 520px) {
    display: block;
  }
`