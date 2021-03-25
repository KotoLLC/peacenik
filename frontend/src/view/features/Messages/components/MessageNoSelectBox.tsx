import React from "react";
import styled from "styled-components";

import { ReactComponent as SendIcon } from "@assets/images/send-outline.svg";
import { SendOutlineWrapper } from "./styles";
import { IconWrapper, Text, TextUnderlined } from "@view/shared/styles";

const MessageNoSelectBox: React.FC = () => (
  <SendOutlineWrapper>
    <IconWrapper>
      <SendIcon fill="#e9ecee" />
    </IconWrapper>
    <Text>
      Start Converstaion with your <TextUnderlined>friends</TextUnderlined>
    </Text>
  </SendOutlineWrapper>
);

export default MessageNoSelectBox;
