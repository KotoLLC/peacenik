import React from 'react';
import { RouteComponentProps } from 'react-router-dom'
import {
  DirectMessageBoxWapper,
  DMContentWrapper,
  DMFooterWapper,
  DMHeaderWrapper,
} from '../styles';
import DirectMessageContent from './DirectMessageContent';
import DirectMessageFooter from './DirectMessageFooter';
import DirectMessageHeader from './DirectMessageHeader';

interface Props extends RouteComponentProps {}

export default function DirectMessageBox(props: Props) {
  const { location } = props
  
  return (
    <DirectMessageBoxWapper>
      <DMHeaderWrapper>
        <DirectMessageHeader />
      </DMHeaderWrapper>

      <DMContentWrapper>
        <DirectMessageContent />
      </DMContentWrapper>

      <DMFooterWapper>
        <DirectMessageFooter location={location}/>
      </DMFooterWapper>
    </DirectMessageBoxWapper>
  );
}
