import { Box, Button, Card, Container, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Appbar from "./Appbar";

function Login({ setUser }: { setUser: any }) {
   const navigate = useNavigate();
   const [username, setUsername] = useState<string>("");
   const [password, setPassword] = useState<string>("");

   useEffect(() => {
      setUser(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   async function attemptLogin(event: any) {
      event.preventDefault();
      const response = await fetch("/api/jomaker/login", {
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
         setUser(data.user);
         localStorage.setItem("user", JSON.stringify(data.user));
         navigate("/jomaker/app");
      }
   }

   return (
      <Box sx={{ flexGrow: 1, backgroundColor: "#a9a9a9" }}>
         <Appbar offline={false} loggedIn={false} username={""}></Appbar>
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
               <Typography variant="h6">Log in to JoMaker</Typography>
               <form
                  onSubmit={(e) => attemptLogin(e)}
                  style={{
                     display: "flex",
                     flexDirection: "column",
                     justifyContent: "center",
                     width: "100%",
                  }}
               >
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
                  <Button variant="contained" sx={{ mt: "10px", mb: "10px" }} type="submit">
                     Log in
                  </Button>
               </form>

               <Link to="/jomaker/register" style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                  <Typography variant="subtitle2">Create an account</Typography>
               </Link>
               <Link to="/jomaker/offline" style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                  <Typography variant="subtitle2">Use Offline Version</Typography>
               </Link>
            </Card>
         </Container>
      </Box>
   );
}

export default Login;
