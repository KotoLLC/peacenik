import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import Actions from '@store/actions'
import AwesomeSlider from 'react-awesome-slider'
import { Slide1 } from './Slide1'
import { Slide2 } from './Slide2'
import { Slide3 } from './Slide3'
import { withNavigationHandlers } from 'react-awesome-slider/dist/navigation'
import { SwipeNote } from './styles'

const NavigationSlider = withNavigationHandlers(AwesomeSlider)

interface Props extends RouteComponentProps {
  onSetAboutUsViewed: () => void
}

export const AboutUs: React.SFC<Props> = (props) => {

  const onGoToMessageHubs = () => {
    props.history.push('/message-hubs/create')
    props.onSetAboutUsViewed()
    localStorage.setItem('kotoIsAboutUsViewed', 'true')
  }

  return (
    <NavigationSlider
      className="awesome-slider"
      organicArrows={true}
      media={[
        {
          children: <Slide1 onGoToMessageHubs={onGoToMessageHubs} />
        }, {
          children: <Slide2 />
        }, {
          children: <Slide3 onGoToMessageHubs={onGoToMessageHubs} />
        }
      ]}
    />
  )
}

type DispatchProps = Pick<Props, 'onSetAboutUsViewed'>
const mapDispatchToProps = (dispath): DispatchProps => ({
  onSetAboutUsViewed: () => dispath(Actions.common.setAboutUsViewed())
})

export default connect(null, mapDispatchToProps)(withRouter(AboutUs))