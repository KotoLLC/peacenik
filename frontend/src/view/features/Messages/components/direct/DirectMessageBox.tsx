import React from 'react';
import {
  DirectMessageBoxWapper,
  DMContentWrapper,
  DMFooterWapper,
  DMHeaderWrapper,
} from '../styles';
import DirectMessageContent from './DirectMessageContent';
import DirectMessageFooter from './DirectMessageFooter';
import DirectMessageHeader from './DirectMessageHeader';

export default function DirectMessageBox() {
  return (
    <DirectMessageBoxWapper>
      {/* <DMHeaderWrapper>
        <DirectMessageHeader />
      </DMHeaderWrapper> */}

      <DMContentWrapper>
        <DirectMessageContent />
      </DMContentWrapper>

      <DMFooterWapper>
        <DirectMessageFooter />
      </DMFooterWapper>
    </DirectMessageBoxWapper>
  );
}
