import { GitHub } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";

function Login() {
   return (
      <Box sx={{ flexGrow: 1, backgroundColor: "#a9a9a9" }}>
         <AppBar position="static">
            <Toolbar variant="dense">
               <Typography variant="h4" color="inherit" component="div" paddingRight={2}>
                  Jo Maker
               </Typography>
               <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1 }}>
                  unbiased diversified team generator
               </Typography>
               <Typography variant="h6" color="inherit">
                  v{process.env.REACT_APP_VERSION}
               </Typography>
               <IconButton onClick={() => (window.location.href = "https://github.com/CraftinPark/jo")} sx={{ ml: 1 }}>
                  <GitHub sx={{ color: "white" }} />
               </IconButton>
            </Toolbar>
         </AppBar>
      </Box>
   );
}

export default Login;
