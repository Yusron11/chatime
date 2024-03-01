import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Contacts from "../component/contacts";
import ChatContainer from "../component/ChatContainer";
import Welcome from "../component/Welcome";
import { allUserRoute, host } from "../utils/APIRoute";
import {io} from "socket.io-client";

export default function Chat() {

  const socket = useRef();

  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!localStorage.getItem("chatime-user")) {
        navigate("/login");
      } else {
        setCurrentUser(
          await JSON.parse(localStorage.getItem("chatime-user"))
        );
      }
    };

    fetchCurrentUser();
  }, [navigate]);
  
  useEffect(()=> {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  })

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        const data = await axios.get(`${allUserRoute}/${currentUser._id}`);
        setContacts(data.data);
      }
    };

    fetchContacts();
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <Container>
      <div className="container">
        <Contacts 
        contacts={contacts} 
        currentUser={currentUser} 
        changeChat={handleChatChange}/>

        {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/>
          )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #40A2E3;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #E0F4FF;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
