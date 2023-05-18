import { AlibabaOutlined, PushpinOutlined, RadarChartOutlined } from "@ant-design/icons";
import styled, { keyframes } from "styled-components";
import { ChatType, ReactionType } from "../../types/types";
import { at, backUrl, WsUrl_reaction } from "../../variable/cookie";
import axios from "axios";
import React, { Props, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBookmarkPage } from "../../variable/ChatBookmarkSlice";
import { RootState } from "../../app/store";
import { setClickedChatReaction, setPushPopReactionArray } from "../../variable/ChatReactionSlice";
import { setUIChatReaction } from "../../variable/ChatReactionUISlice";
import { RemoveReactionChat, UpdateReactionChat } from "../../variable/WorkSpaceSlice";
import Chat from "./Chat";
import ReactTooltip from "react-tooltip";

const ChatOption = (chat: ChatType) => {
  const [showDetail, setShowDetail] = useState<number>(-1);
  const chat_channel_hashed_value = useSelector((state: RootState) => state.ClickedChannel.channelData.hashed_value);
  const dispatch = useDispatch();
  const cid = parseInt(chat.id);
  const chat_reaction = useSelector((state: RootState) => state.getMyWorkSpace.Reaction);
  //const mode = useSelector((state: RootState) => state.reaction.Reaction.mode);
  const [reactionSocket, setReactionSocket] = useState<WebSocket>();
  //const mode = useSelector((state: RootState) => state.ChatReaction.reactionData.mode);
  const icon = useSelector((state: RootState) => state.getMyWorkSpace.Reaction.icon);
  //const chat_id = useSelector((state: RootState) => state.reaction.Reaction.chat_id);
  const icon_UI = useSelector((state: RootState) => state.ChatReaction.reactionData.icon);
  const [isHovering, setIsHovering] = useState(0);

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
  const sendReaction = async (mode_s: string, icon_s: string, chat_id_s: number) => {
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
            mode: mode_s,
            icon: icon_s,
            chat_id: chat_id_s,
          }),
        );
        ReactionWs.onmessage = res => {
          const data = JSON.parse(res.data);
          if (res.data.toString().match("reactor")) {
            console.log("reaction Data " + JSON.stringify(data));
          }
          //dispatch(UpdateReactionChat([chat_channel_hashed_value, { mode: res.data.mode, icon: res.data.icon, chat_id: res.data.chat_id }]));
          //dispatch(setClickedChatReaction(data));
        };
      };
      setReactionSocket(ReactionWs);
    }
  };
  function ReactionLogic(clickedIcon: string, cid: number) {
    if (icon === "" && clickedIcon) {
      //리액션이 없을때 새로운 리액션을 추가
      //dispatch(setClickedChatReaction({ mode: "create", icon: clickedIcon, chat_id: cid }));
      sendReaction("create", clickedIcon, cid);
      dispatch(UpdateReactionChat([chat_channel_hashed_value, { mode: "create", chat_id: cid, icon: clickedIcon }]));
    } else if (icon.match(clickedIcon)) {
      // 리액션이 있을때 같은 리액션을 누르면 삭제
      dispatch(RemoveReactionChat([chat_channel_hashed_value, { mode: "delete", chat_id: cid, icon: clickedIcon }]));
      sendReaction("delete", clickedIcon, cid);
      //console.log("{ clicked icon: " + clickedIcon + ", \n" + " saved icon: " + icon + ", \n" + " chat_id: " + cid + ", \n" + " chat_reaction data: " + JSON.stringify(chat_reaction) + ", \n}");
    }
    console.log("{ clicked icon: " + clickedIcon + ", \n" + " saved icon: " + icon + ", \n" + " chat_id: " + cid + ", \n" + " chat_reaction data: " + JSON.stringify(chat_reaction) + ", \n}");
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
