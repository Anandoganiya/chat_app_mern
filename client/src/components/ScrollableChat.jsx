import { useEffect } from "react";
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user.data.data._id) ||
              isLastMessage(messages, i, user.data.data._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                background: `${
                  m.sender._id === user._id
                    ? "hsla(0, 100%, 67%, 1) linear-gradient(90deg, hsla(0, 100%, 67%, 1) 0%, hsla(0, 100%, 89%, 1) 100%)"
                    : "hsla(0, 100%, 67%, 1) linear-gradient(90deg, hsla(0, 100%, 67%, 1) 0%, hsla(0, 100%, 89%, 1) 100%)"
                }`,
                marginLeft: isSameSenderMargin(
                  messages,
                  m,
                  i,
                  user.data.data._id
                ),
                marginTop: isSameUser(messages, m, i, user.data.data._id)
                  ? 3
                  : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
