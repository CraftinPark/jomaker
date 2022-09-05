import Login from "./Login";
import App from "./App";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import { member } from "./util/types";
import OfflineApp from "./OfflineApp";
import Register from "./Register";

function Main() {
   const [loggedIn, setLoggedIn] = useState<boolean>(false);
   const [user, setUser] = useState<{
      _id: string;
      username: string;
      password: string;
      memberList: member[];
      previousJos: member[][];
      settings: any;
   }>({
      _id: "",
      username: "",
      password: "",
      memberList: [],
      previousJos: [],
      settings: {},
   });

   return (
      <BrowserRouter>
         <Routes>
            <Route
               path="/jomaker"
               element={loggedIn ? <Navigate replace to="/jomaker/app" /> : <Navigate replace to="/jomaker/login" />}
            />
            <Route path="/jomaker/login" element={<Login setUser={setUser} setLoggedIn={setLoggedIn} />} />
            <Route path="/jomaker/register" element={<Register />} />
            <Route
               path="/jomaker/app"
               element={loggedIn ? <App user={user}  setLoggedIn={setLoggedIn}/> : <Navigate replace to="/jomaker/login" />}
            />
            <Route path="/jomaker/offline" element={<OfflineApp />} />
         </Routes>
      </BrowserRouter>
   );
}
export default Main;
