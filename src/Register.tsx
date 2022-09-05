import { GitHub } from "@mui/icons-material";
import { AppBar, Box, Button, Card, Container, IconButton, TextField, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
   const navigate = useNavigate();
   const [username, setUsername] = useState<string>("");
   const [password, setPassword] = useState<string>("");
   const [confirmPassword, setConfirmPassword] = useState<string>("");

   async function attemptRegisterUser(event: any) {
      event.preventDefault();

      if (password !== confirmPassword) {
         // not same password error
      } else {
         const response = await fetch("/api/jomaker/register", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               username: username,
               password: password,
            }),
         });
         const data = await response.json();
         if (data.status === "error") console.log("there was an error");
         else if (data.status === "ok") {
            console.log(data.user);
            navigate("/jomaker/login");
         }
      }
   }

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
         <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "90vh" }}>
            <Card
               sx={{
                  width: "320px",
                  backgroundColor: "Gainsboro",
                  padding: "25px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
               }}
            >
               <Typography variant="h6">Register User for JoMaker</Typography>
               <form onSubmit={(e) => attemptRegisterUser(e)}>
                  <TextField
                     required
                     label="username"
                     variant="outlined"
                     size="small"
                     fullWidth
                     sx={{ mt: "10px" }}
                     onChange={(e) => setUsername(e.target.value)}
                  />
                  <TextField
                     required
                     type="password"
                     label="password"
                     variant="outlined"
                     size="small"
                     fullWidth
                     sx={{ mt: "10px" }}
                     onChange={(e) => setPassword(e.target.value)}
                  />
                  <TextField
                     required
                     type="password"
                     label="confirm password"
                     variant="outlined"
                     size="small"
                     fullWidth
                     sx={{ mt: "10px" }}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button variant="contained" sx={{ mt: "10px", mb: "10px" }} type="submit">
                     Register
                  </Button>
               </form>

               <Link to="/jomaker/login">use existing account</Link>
            </Card>
         </Container>
      </Box>
   );
}

export default Register;
