import styled from "styled-components";
import React, { useCallback, useState } from "react";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { Avatar } from "@material-ui/core";
import { Button, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import {
  at,
  AtVerify,
  backUrl,
  removeCookie,
  UpdateToken,
} from "../../../variable/cookie";

const Members = () => {
  const currentChannel = useSelector(
    (state: RootState) => state.getMyWorkSpace.SearchedChannel
  );
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const closeAddUserModal = () => {
    setShowAddUserModal(false);
  };

  return (
    <>
      <SearchBar>
        <div className="group">
          <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
          </svg>
          <input placeholder="Find members" type="search" className="input" />
        </div>
      </SearchBar>
      <div className="mt-1 mx-auto text-lg overflow-y-scroll max-h">
        <User
          onClick={() => {
            setShowAddUserModal(true);
          }}
        >
          <GroupAddIcon
            style={{
              fontSize: 30,
              marginRight: 10,
            }}
          />
          <h1>Add People</h1>
        </User>
        {currentChannel &&
          currentChannel.members.map((member, i) => {
            return (
              <User key={i}>
                <HeaderAvatar src={member.profile_image} />
                <h1>{member.username}</h1>
              </User>
            );
          })}
      </div>
      {showAddUserModal && (
        <AddUserModal
          CloseModal={() => {
            closeAddUserModal();
          }}
          channel={currentChannel}
        />
      )}
    </>
  );
};
const HeaderAvatar = styled(Avatar)`
  margin-right: 10px;
`;

const User = styled.span`
  align-items: center;
  width: 100%;
  display: flex;
  padding: 0.5rem;

  :hover {
    cursor: pointer;
    opacity: 0.6;
    background-color: #9ca3af;
  }
`;
const SearchBar = styled.div`
  .group {
    display: flex;
    line-height: 28px;
    align-items: center;
    position: relative;
  }

  .input {
    width: 100%;
    height: 40px;
    line-height: 28px;
    padding: 0 1rem;
    padding-left: 2.5rem;
    border: 2px solid transparent;
    border-radius: 8px;
    outline: none;
    background-color: #f3f3f4;
    color: #0d0c22;
    transition: 0.3s ease;
  }

  .input::placeholder {
    color: #9e9ea7;
  }

  .input:focus,
  input:hover {
    outline: none;
    border-color: rgba(234, 76, 137, 0.4);
    background-color: #fff;
    box-shadow: 0 0 0 4px rgb(234 76 137 / 10%);
  }

  .icon {
    position: absolute;
    left: 1rem;
    fill: #9e9ea7;
    width: 1rem;
    height: 1rem;
  }
`;

const AddUserModal = (props: any) => {
  const currentWorkspace = useSelector(
    (state: RootState) => state.getMyWorkSpace.ClickedWorkSpace
  );
  const [EditInput, setEditInput] = useState("");
  const onChangeEditInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditInput(e.target.value);
    },
    []
  );
  const AddUsertoChannel = async () => {
    if ((await AtVerify()) == 200) {
      try {
        const d = await axios.post(
          `${backUrl}channel/${currentWorkspace.hashed_value}/${props.channel.hashed_value}/members/`,
          { members_usernames: [{ EditInput }] },
          {
            headers: {
              Authorization: `Bearer ${at}`,
            },
          }
        );
        //유저가 행동을 한다는 것 이므로 토큰 새로받아줌
        UpdateToken();
      } catch (err) {
        console.log(err);
      }
    } else {
      //행동할 때만 유지시키기 위해서 이미 만료됐으면 재로그인
      removeCookie();
      // TODO document why this block is empty
    }
  };

  return (
    <>
      <div
        className="relative z-10"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="mt-10 sm:mt-0">
              <div className="wrapper-center">
                <div className="mt-5 md:col-span-2 md:mt-0">
                  <div className="overflow-hidden shadow sm:rounded-md">
                    <div className="bg-white py-5 sm:p-6 space-y-6">
                      {/*내부*/}
                      <div className="flex justify-between">
                        <div className="float-l">
                          <h1>Add Member</h1>
                          <h1>#{props.name}</h1>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            props.CloseModal();
                          }}
                          className="rounded-md text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
                        >
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                      <Input
                        size="large"
                        value={EditInput}
                        onChange={onChangeEditInput}
                        placeholder="Enter a name or email"
                        prefix={<UserOutlined />}
                      />
                      <Button
                        onClick={() => {
                          AddUsertoChannel();
                          console.log(EditInput);
                        }}
                      >
                        Add
                      </Button>
                      {/*내부*/}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Members;
