import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { recieveMessageRoute, sendMessageRoute } from "../utils/APIRoute";
import Avatar from "../assets/user.png";

export default function ChatContainer({ currentChat, currentUser, socket }) {
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const scrollRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (currentChat) {
                    const response = await axios.post(recieveMessageRoute, {
                        from: currentUser._id,
                        to: currentChat._id,
                    });
                    setMessages(response.data);
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
        fetchData();
    }, [currentChat]);

    const handleSendMsg = async (msg) => {
        await axios.post(sendMessageRoute,  {
            from: currentUser._id,
            to: currentChat._id,
            message: msg,
        });
        socket.current.emit("send-msg", {
            to: currentChat._id,
            from: currentUser._id,
            message: msg,
        });
        const msgs = [...messages, { fromSelf: true, message: msg }];
        console.log(msgs);
        setMessages(msgs);
    };
    
    useEffect(() => {
        if (socket.current) {
            socket.current.on("msg-recieve", (msg) => {
                setArrivalMessage(msg);
            });
        }
    }, [socket]);
    
    useEffect(() => {
        if (arrivalMessage) {
            setMessages((prevMessages) => [...prevMessages, arrivalMessage]);
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [arrivalMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
            {currentChat && (
                <Container>
                <div className="chat-header">
                    <div className="user-details">
                        <div className="avatar">
                            <img
                            src={Avatar}
                            alt="avatar"
                            />
                        </div>
                        <div className="username">
                            <h3>{currentChat.username}</h3>
                        </div>
                    </div>
                    <Logout />
                </div>
                <div className="chat-messages">
                    {messages.map((message) => {
                    return (
                        <div key={uuidv4()}>
                            <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
                                <div className="content">
                                  <p>{message.message}</p>
                                </div>
                            </div>
                        </div>
                    );
                    })}
                    <div ref={scrollRef}></div>
                </div>
                <ChatInput handleSendMsg={handleSendMsg} />
                </Container>
            )}
        </>
    );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    background-color: #525CEB;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
