import React from 'react';
import { RouteComponentProps } from 'react-router-dom'
import { useRouteMatch } from 'react-router';
import {
  DirectMessageBoxWapper,
  DMContentWrapper,
  DMFooterWapper,
  DMHeaderWrapper,
} from '../styles';
import DirectMessageContent from './DirectMessageContent';
import DirectMessageFooter from './DirectMessageFooter';
import DirectMessageHeader from './DirectMessageHeader';

interface Props extends RouteComponentProps { }

export default function DirectMessageBox(props: Props) {
  const { location } = props

  const userid = useRouteMatch().params['id'] || undefined;
  if (userid)
    return (
      <DirectMessageBoxWapper>
        <DMHeaderWrapper>
          <DirectMessageHeader />
        </DMHeaderWrapper>

        <DMContentWrapper>
          <DirectMessageContent />
        </DMContentWrapper>

        <DMFooterWapper>
          <DirectMessageFooter location={location} />
        </DMFooterWapper>
      </DirectMessageBoxWapper>
    );
  else
    return <></>
}
