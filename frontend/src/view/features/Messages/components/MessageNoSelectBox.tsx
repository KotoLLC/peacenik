import React from "react";
// import styled from "styled-components";

import { ReactComponent as SendIcon } from "@assets/images/send-outline.svg";
import { SendOutlineWrapper } from "./styles";
import { IconWrapper, Text, StyledLink } from "@view/shared/styles";

const MessageNoSelectBox: React.FC = () => (
  <SendOutlineWrapper>
    <IconWrapper>
      <SendIcon fill="#e9ecee" />
    </IconWrapper>
    <Text>
      Start Converstaion with your <StyledLink to="/friends">friends</StyledLink>
    </Text>
  </SendOutlineWrapper>
);

export default MessageNoSelectBox;
