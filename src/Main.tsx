import Login from "./Login";
import App from "./App";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { member } from "./util/types";
import OfflineApp from "./OfflineApp";
import Register from "./Register";

export type user = {
   _id: string;
   username: string;
   password: string;
   memberList: member[];
   previousJos: member[][];
   settings: any;
};

function Main() {
   useEffect(() => {
      const getPreservedUser = async () => {};

      getPreservedUser();
   }, []);

   const [user, setUser] = useState<user | false>(() => {
      const localData = localStorage.getItem("user");
      return localData !== "false" && localData ? JSON.parse(localData) : false;

      // attempt login
   });

   return (
      <BrowserRouter>
         <Routes>
            <Route
               path="/jomaker"
               element={user ? <Navigate replace to="/jomaker/app" /> : <Navigate replace to="/jomaker/login" />}
            />
            <Route path="/jomaker/login" element={<Login setUser={setUser} />} />
            <Route path="/jomaker/register" element={<Register />} />
            <Route
               path="/jomaker/app"
               element={user ? <App user={user} /> : <Navigate replace to="/jomaker/login" />}
            />
            <Route path="/jomaker/offline" element={<OfflineApp />} />
         </Routes>
      </BrowserRouter>
   );
}
export default Main;
