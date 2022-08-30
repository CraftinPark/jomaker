import Login from "./Login";
import App from "./App";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";

function Main() {
   const [loggedIn, setLoggedIn] = useState<boolean>(false);

   return (
      <BrowserRouter>
         <Routes>
            <Route
               path="/jomaker"
               element={loggedIn ? <Navigate replace to="/jomaker/app" /> : <Navigate replace to="/jomaker/login" />}
            />
            <Route path="/jomaker/login" element={<Login />} />
            <Route path="/jomaker/app" element={<App />} />
         </Routes>
      </BrowserRouter>
   );
}
export default Main;
