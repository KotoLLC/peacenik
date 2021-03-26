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
    msgId: "123-4123412341-12341234134-12341234",
    direction: MessageDirection.INCOMMING_MESSAGE,
    actionTime: new Date("2021-3-26"),
    status: MessagePublishStatus.ACCEPTED_STATUS,
    contentType: MessageContentType.TEXT_TYPE,
    messeageContent:
      "I'm looking for a truly expert in Python Flask. Please do not send any offer if you don't have 200+ hours of experience with Flask! We expect you to work between 20 and 40 hours per week. We always stay flexible. I'm a Computer Scientist, coding geek and I have significant knowledge of Flask. Because of that, I expect top quality. This job is for you if you... - Enjoy writing Pythonic code and that follows conventions (PEP8) - Like simple solutions, but also to architect the code using OOP and inheritance when needed. - Have experience with the flask ecosystem and enjoy to work with it (sqlalchemy, flask admin, flask migrations / alembic) - Hate copy and pasting code and prefer to use functions or classes instead. - Enjoy working in a project with others you can teach and learn from, communicating through github. - Always use the right libraries to do the job and end with less code and easier to maintain. Hate reinventing the wheel. - Have a good understanding of git and know how to properly do things like rebase, merge and cherry-pick. - Don't get bored writing understandable code and comments. Or hunting bugs. - Like to enjoy flexibility. We are super flexible fully remote team. Our stack: - Python - Flask - Flask migrate / alembic. - Postgres - Flask admin - Selenium and Behave (for testing) - Bootstrap and JQuery We are already four developers and we need someone else to tackle all the upcoming working. Speaking Spanish is a plus!",
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
