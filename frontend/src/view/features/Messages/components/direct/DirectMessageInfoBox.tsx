import React from 'react';
import {
  DirectMessageBoxWapper,
  DMContentInfoWrapper,
  DMHeaderWrapper,
} from '../styles';
import DirectMessageInfoContent from './DirectMessageInfoContent';
import DirectMessageInfoHeader from './DirectMessageInfoHeader';

export default function DirectMessageInfoBox() {
  return (
    <DirectMessageBoxWapper>
      <DMHeaderWrapper>
        <DirectMessageInfoHeader />
      </DMHeaderWrapper>
      <DMContentInfoWrapper>
        <DirectMessageInfoContent />
      </DMContentInfoWrapper>
    </DirectMessageBoxWapper>
  );
}
