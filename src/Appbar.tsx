import { GitHub } from "@mui/icons-material";
import { AppBar, Button, Dialog, IconButton, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChangelogDialog from "./ChangelogDialog";

function Appbar({ offline, loggedIn, username }: { offline: boolean; loggedIn: boolean; username?: string }) {
   const navigate = useNavigate();
   const [dialogOpened, setDialogOpened] = useState<boolean>(false);

   function loggedInComponent() {
      if (offline) {
         return (
            <>
               <Button
                  variant="outlined"
                  sx={{ color: "white", borderColor: "white" }}
                  onClick={() => {
                     navigate("/jomaker/login");
                  }}
               >
                  Log in
               </Button>
            </>
         );
      } else if (loggedIn) {
         return (
            <>
               <Typography variant="subtitle1" color="inherit" sx={{ mr: "14px", color: "gold" }}>
                  Welcome, {username}
               </Typography>
               <Button
                  size="small"
                  variant="outlined"
                  sx={{
                     color: "white",
                     borderColor: "white",
                     "&:hover": {
                        backgroundColor: "#2d608a",
                        color: "white",
                     },
                  }}
                  onClick={() => {
                     navigate("/jomaker/login");
                     localStorage.setItem("user", "false");
                  }}
               >
                  Log out
               </Button>
            </>
         );
      } else return <></>;
   }

   return (
      <AppBar position="static">
         <Toolbar variant="dense">
            <Typography variant="h4" color="inherit" component="div" paddingRight={1}>
               Jo Maker
            </Typography>
            <Typography variant="h6" color="inherit" sx={{ mt: "10px", mr: "20px" }}>
               v{process.env.REACT_APP_VERSION}
            </Typography>
            <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1 }}>
               unbiased diversified team generator
            </Typography>
            <Button sx={{ mt: 1}} variant="text" color="inherit" onClick={() => setDialogOpened(true)}>
               Changelogs
            </Button>
            <ChangelogDialog dialogOpened={dialogOpened} setDialogOpened={setDialogOpened} />
            <IconButton
               onClick={() => (window.location.href = "https://github.com/CraftinPark/jo")}
               sx={{ ml: 1, mr: 2 }}
            >
               <GitHub sx={{ color: "white" }} />
            </IconButton>
            {loggedInComponent()}
         </Toolbar>
      </AppBar>
   );
}

export default Appbar;
