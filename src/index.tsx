import { createTheme, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import Main from "./Main";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const theme = createTheme({
   palette: {
      primary: {
         main: "#4682b4", // This is an orange looking color
         contrastText: "#fff",
      },
   },
   typography: {
      fontFamily: ["Rubik"].join(","),
   },
});

root.render(
   <React.StrictMode>
      <ThemeProvider theme={theme}>
         <Main />
      </ThemeProvider>
   </React.StrictMode>
);
