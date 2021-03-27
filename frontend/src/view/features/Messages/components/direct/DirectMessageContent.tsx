import React from "react";
import {
  MessageContentType,
  MessageDirection,
  MessageItemProps,
  MessagePublishStatus,
} from "../../types/types";
import MessageItem from "../common/MessageItem";

const items: MessageItemProps[] = [
  {
    msgId: "4234123-4123412341-12341234134-12341234",
    direction: MessageDirection.OUTGOING_MESSAGE,
    actionTime: new Date("2021-3-26"),
    status: MessagePublishStatus.ACCEPTED_STATUS,
    contentType: MessageContentType.TEXT_TYPE,
    messeageContent:
      "We expect you to work between 20 and 40 hours per week. We always stay flexible. I'm a Computer Scientist, coding geek and I have significant knowledge of Flask. Because of that, I expect top quality. ",
  },
  {
    msgId: "5123-4123412341-12341234134-12341234",
    direction: MessageDirection.INCOMMING_MESSAGE,
    actionTime: new Date("2021-3-26"),
    status: MessagePublishStatus.ACCEPTED_STATUS,
    contentType: MessageContentType.IMAGE_TYPE,
    messeageContent: "https://www.w3schools.com/html/pic_trulli.jpg",
  },
  {
    msgId: "1452323-4123412341-12341234134-12341234",
    direction: MessageDirection.INCOMMING_MESSAGE,
    actionTime: new Date("2021-3-26"),
    status: MessagePublishStatus.ACCEPTED_STATUS,
    contentType: MessageContentType.TEXT_TYPE,
    messeageContent:
      "I'm looking for a truly expert in Python Flask. I'm looking for a truly expert in Python Flask. Please do not send any offer if you don't have 200+ hours of experience with Flask! ",
  },
  {
    msgId: "12334523-4123412341-12341234134-12341234",
    direction: MessageDirection.OUTGOING_MESSAGE,
    actionTime: new Date("2021-3-26"),
    status: MessagePublishStatus.ACCEPTED_STATUS,
    contentType: MessageContentType.TEXT_TYPE,
    messeageContent:
      "Please do not send any offer if you don't have 200+ hours of experience with Flask! ",
  },
  {
    msgId: "675123-4123412341-12341234134-12341234",
    direction: MessageDirection.INCOMMING_MESSAGE,
    actionTime: new Date("2021-3-26"),
    status: MessagePublishStatus.ACCEPTED_STATUS,
    contentType: MessageContentType.TEXT_TYPE,
    messeageContent:
      "I'm looking for a truly expert in Python Flask. Please do not send any offer if you don't have 200+ hours of experience with Flask! ",
  },
  {
    msgId: "1293903-4123412341-12341234134-12341234",
    direction: MessageDirection.INCOMMING_MESSAGE,
    actionTime: new Date("2021-3-26"),
    status: MessagePublishStatus.ACCEPTED_STATUS,
    contentType: MessageContentType.TEXT_TYPE,
    messeageContent: "I'm looking for a truly",
  },
];

const DirectMessageContent = () => {
  return (
    <div>
      {items.map((item) => (
        <MessageItem key={item.msgId} {...item}></MessageItem>
      ))}
    </div>
  );
};

export default DirectMessageContent;
