import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Register from './view/register';
import Login from './view/login';
import Chat from './view/chat';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/register" element= {<Register/>} />
        <Route path="/login" element= {<Login/>} />
        <Route path="/" element= {<Chat/>} />

      </Routes>
    </BrowserRouter>
  );
}
