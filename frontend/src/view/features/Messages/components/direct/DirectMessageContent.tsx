import React from "react";
import { CommonTypes, Enum } from 'src/types'
import { RouteComponentProps } from 'react-router-dom'
import MessageItem from "../common/MessageItem";
import { useSelector, useDispatch } from 'react-redux'
import Actions from '@store/actions'
import { StoreTypes } from 'src/types'

const items: CommonTypes.MessageTypes.MessageItemProps[] = [
  {
    msgId: "4234123-4123412341-12341234134-12341234",
    direction: Enum.MessageDirection.OUTGOING_MESSAGE,
    actionTime: new Date("2021-3-26"),
    status: Enum.MessagePublishStatus.ACCEPTED_STATUS,
    contentType: Enum.MessageContentType.TEXT_TYPE,
    messeageContent:
      "We expect you to work between 20 and 40 hours per week. We always stay flexible. I'm a Computer Scientist, coding geek and I have significant knowledge of Flask. Because of that, I expect top quality. ",
  },
  {
    msgId: "5123-4123412341-12341234134-12341234",
    direction: Enum.MessageDirection.INCOMMING_MESSAGE,
    actionTime: new Date("2021-3-26"),
    status: Enum.MessagePublishStatus.ACCEPTED_STATUS,
    contentType: Enum.MessageContentType.IMAGE_TYPE,
    messeageContent: "https://www.w3schools.com/html/pic_trulli.jpg",
  },
  {
    msgId: "5123000-4123412341-12341234134-12341234",
    direction: Enum.MessageDirection.OUTGOING_MESSAGE,
    actionTime: new Date("2021-3-26"),
    status: Enum.MessagePublishStatus.ACCEPTED_STATUS,
    contentType: Enum.MessageContentType.IMAGE_TYPE,
    messeageContent: "https://www.w3schools.com/html/pic_trulli.jpg",
  },
  {
    msgId: "1452323-4123412341-12341234134-12341234",
    direction: Enum.MessageDirection.INCOMMING_MESSAGE,
    actionTime: new Date("2021-3-26"),
    status: Enum.MessagePublishStatus.ACCEPTED_STATUS,
    contentType: Enum.MessageContentType.TEXT_TYPE,
    messeageContent:
      "I'm looking for a truly expert in Python Flask. I'm looking for a truly expert in Python Flask. Please do not send any offer if you don't have 200+ hours of experience with Flask! ",
  },
  {
    msgId: "12334523-4123412341-12341234134-12341234",
    direction: Enum.MessageDirection.OUTGOING_MESSAGE,
    actionTime: new Date("2021-3-26"),
    status: Enum.MessagePublishStatus.ACCEPTED_STATUS,
    contentType: Enum.MessageContentType.TEXT_TYPE,
    messeageContent:
      "Please do not send any offer if you don't have 200+ hours of experience with Flask! ",
  },
  {
    msgId: "675123-4123412341-12341234134-12341234",
    direction: Enum.MessageDirection.INCOMMING_MESSAGE,
    actionTime: new Date("2021-3-26"),
    status: Enum.MessagePublishStatus.ACCEPTED_STATUS,
    contentType: Enum.MessageContentType.TEXT_TYPE,
    messeageContent:
      "I'm looking for a truly expert in Python Flask. Please do not send any offer if you don't have 200+ hours of experience with Flask! ",
  },
  {
    msgId: "51293903-4123412341-12341234134-12341234",
    direction: Enum.MessageDirection.INCOMMING_MESSAGE,
    actionTime: new Date("2021-3-26"),
    status: Enum.MessagePublishStatus.ACCEPTED_STATUS,
    contentType: Enum.MessageContentType.TEXT_TYPE,
    messeageContent: "I'm looking for a truly",
  },
  {
    msgId: "1293903-4123412341-12341234134-12341234",
    direction: Enum.MessageDirection.OUTGOING_MESSAGE,
    actionTime: new Date("2021-3-26"),
    status: Enum.MessagePublishStatus.ACCEPTED_STATUS,
    contentType: Enum.MessageContentType.TEXT_TYPE,
    messeageContent: "I'm looking for a truly",
  },
];

[
  {
      "id": "5e183be8-be6e-44b9-9562-85eb87a282aa",
      "user_id": "2c415538-e86f-4553-a3d1-49ff2d4ab3ff",
      "text": "Test",
      "attachment": "",
      "attachment_type": "",
      "attachment_thumbnail": "",
      "created_at": "2021-04-09T08:36:21.433-06:00",
      "updated_at": "2021-04-09T08:36:21.433-06:00",
      "likes": 0,
      "liked_by_me": false,
      "comments": [],
      "liked_by": [],
      "is_read": false
  }
]

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
