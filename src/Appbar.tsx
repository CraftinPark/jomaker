import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Appbar({ offline, loggedIn, username }: { offline: boolean; loggedIn: boolean; username: string }) {
   const navigate = useNavigate();

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
            {/* <IconButton onClick={() => (window.location.href = "https://github.com/CraftinPark/jo")} sx={{ ml: 1 }}>
          <GitHub sx={{ color: "white" }} />
       </IconButton> */}
            <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1 }}>
               unbiased diversified team generator
            </Typography>
            {loggedInComponent()}
         </Toolbar>
      </AppBar>
   );
}

export default Appbar;
