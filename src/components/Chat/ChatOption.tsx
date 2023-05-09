import { AlibabaOutlined, PushpinOutlined, RadarChartOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { ChatType } from "../../types/types";
import { at, backUrl, WsUrl_reaction } from "../../variable/cookie";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBookmarkPage } from "../../variable/ChatBookmarkSlice";
import { RootState } from "../../app/store";
import { setClickedChatReaction, setPushPopReactionArray } from "../../variable/ChatReactionSlice";
import { setUIChatReaction } from "../../variable/ChatReactionUISlice";

const ChatOption = (chat: ChatType) => {
  const [showDetail, setShowDetail] = useState<number>(-1);
  const chat_channel_hashed_value = useSelector((state: RootState) => state.ClickedChannel.channelData.hashed_value);
  const dispatch = useDispatch();
  const cid = parseInt(chat.id);
  const [reactionSocket, setReactionSocket] = useState<WebSocket>();
  const mode = useSelector((state: RootState) => state.ChatReaction.reactionData.mode);
  const icon = useSelector((state: RootState) => state.ChatReaction.reactionData.icon);
  const chat_id = useSelector((state: RootState) => state.ChatReaction.reactionData.chat_id);
  const icon_UI = useSelector((state: RootState) => state.ChatReaction.reactionData.icon);
  const ReactionArr = useSelector((state: RootState) => state.ChatReaction.reactionArray);
  const [ChatReaction, setReaction] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const DeleteChatBookmark = async () => {
    //chat/bookmark에 들어가는 chat_id는 다른 데이터구조(string)과는 달리 number라 형변환
    await axios
      .delete(`${backUrl}chat/bookmark/${cid}/`, {
        headers: {
          Authorization: `Bearer ${at}`,
        },
      })
      .then(res => {
        console.log(res);
        dispatch(getBookmarkPage());
      })
      .catch(err => {
        console.log(err);
      });
  };

  /*  useEffect(() => {
    const ReactionWs = new WebSocket(`${WsUrl_reaction}${chat_channel_hashed_value}/`);
    if (ReactionWs) {
      ReactionWs.onopen = () => {
        setReactionSocket(ReactionWs);
        ReactionWs.send(
          JSON.stringify({
            authorization: at,
          }),
        );
        ReactionWs.onmessage = res => {
          const data = JSON.parse(res.data);
          setUserId(res.data.reactor);
          console.log("reaction Data " + JSON.stringify(data));
          //dispatch(setClickedChatReaction(data));
        };
      };
    }
  }, [chat_channel_hashed_value]);*/

  const sendReaction = async () => {
    const ReactionWs = new WebSocket(`${WsUrl_reaction}${chat_channel_hashed_value}/`);
    if (ReactionWs) {
      ReactionWs.onopen = () => {
        setReactionSocket(ReactionWs);
        ReactionWs.send(
          JSON.stringify({
            authorization: at,
          }),
        );
        ReactionWs.send(
          JSON.stringify({
            mode: mode,
            icon: icon,
            chat_id: chat_id,
          }),
        );
        ReactionWs.onmessage = res => {
          const data = JSON.parse(res.data);
          setUserId(res.data.reactor);
          console.log("reaction Data " + JSON.stringify(data));
          //dispatch(setClickedChatReaction(data));
        };
      };
      setReactionSocket(ReactionWs);
    }
  };

  const MakeChatBookmark = async () => {
    //chat/bookmark에 들어가는 chat_id는 다른 데이터구조(string)과는 달리 number라 형변환
    await axios
      .post(
        `${backUrl}chat/bookmark/`,
        {
          chat_id: cid,
        },
        {
          headers: {
            Authorization: `Bearer ${at}`,
          },
        },
      )
      .then(res => {
        console.log(res);
        dispatch(getBookmarkPage());
      })
      .catch(err => {
        console.log(err);
      });
  };

  function ReactionLogic(clickedIcon: string, cid: number) {
    if (icon === "" && clickedIcon) {
      //리액션이 없을때 새로운 리액션을 추가
      dispatch(setClickedChatReaction({ mode: "create", icon: clickedIcon, chat_id: cid }));
      dispatch(setUIChatReaction({ mode: "create", icon: clickedIcon, chat_id: cid }));
      //dispatch(setPushPopReactionArray(clickedIcon));
      sendReaction();
    } else if (icon.match(clickedIcon) && icon_UI.match(clickedIcon)) {
      // 리액션이 있을때 같은 리액션을 누르면 삭제
      dispatch(setClickedChatReaction({ mode: "delete", icon: icon.replace(clickedIcon, ""), chat_id: cid }));
      dispatch(setUIChatReaction({ mode: "delete", icon: icon_UI.replace(clickedIcon, ""), chat_id: cid }));
      sendReaction();
    } else {
      // 리액션이 있을때 다른 리액션을 누르면 새로운 리액션 추가
      dispatch(setClickedChatReaction({ mode: "create", icon: icon + clickedIcon, chat_id: cid }));
      dispatch(setUIChatReaction({ mode: "create", icon: icon_UI + clickedIcon, chat_id: cid }));
      sendReaction();
    }
  }

  const ChatOptionDetailArray = [
    {
      detailMessage: chat.has_bookmarked ? "UnChatBookmark" : "ChatBookmark",
      func: () => {
        if (!chat.has_bookmarked) {
          MakeChatBookmark();
        } else {
          DeleteChatBookmark();
        }
      },
      Icon: <PushpinOutlined />,
    },
    {
      detailMessage: "test",
      func: () => {
        console.log("test");
      },
      Icon: <RadarChartOutlined />,
    },
    {
      detailMessage: icon.match("👀") ? "you already signed" : "Sign as shown",
      func: () => {
        ReactionLogic("👀", cid);
      },
      Icon: "👀",
    },
    {
      detailMessage: icon.match("👍") ? "you already signed" : "Thumb Up",
      func: () => {
        ReactionLogic("👍", cid);
      },
      Icon: "👍",
    },
  ];

  return (
    <>
      {ChatOptionDetailArray &&
        ChatOptionDetailArray.map((ChatOptionDetail, i) => {
          return (
            <Option
              key={i}
              onClick={() => {
                ChatOptionDetail.func();
              }}
              onMouseOver={() => {
                setShowDetail(i);
              }}
              onMouseLeave={() => {
                setShowDetail(-1);
              }}
            >
              {/*{showDetail === i && <ChatOptionDetailMessage de={ChatOptionDetail.detailMessage} />}*/}
              {showDetail === i && <ChatOptionDetailMessage />}
              {ChatOptionDetail.Icon}
            </Option>
          );
        })}
    </>
  );
};

export default ChatOption;

const Option = styled.span`
  font-size: 1.5rem;
  border-radius: 10% / 50%;

  :hover {
    text-underline-colorcolor: black;
    cursor: pointer;
    opacity: 0.6;
    background-color: #9ca3af;
  }
`;

const ChatOptionDetailMessage = (props: any) => {
  return <>{props.de}</>;
};
