import React, { useEffect, useState } from "react";
import { AppBar, Box, Button, Grid, IconButton, Toolbar, Typography } from "@mui/material";
import { GitHub } from "@mui/icons-material";

import { member } from "./util/types";
import { createDiversifiedJos, turntableAssign } from "./util/joMaker";

import MembersPanel from "./components/MembersPanel";
import JosPanel from "./components/JosPanel";
import SettingsPanel from "./components/SettingsPanel";
import { useNavigate } from "react-router-dom";

function App({
   user,
   setLoggedIn,
}: {
   user: {
      _id: string;
      username: string;
      password: string;
      memberList: member[];
      previousJos: member[][];
      settings: any;
   };
   setLoggedIn: any;
}) {
   const navigate = useNavigate();
   const [members, setMembers] = useState<member[]>(user.memberList);
   const [jos, setJos] = useState<member[][]>(user.previousJos);
   const [numJos, setNumJos] = useState<number>(3);
   const [useAlgorithm, setUseAlgorithm] = useState<boolean>(true);
   const [inclusionList, setInclusionList] = useState<string>(user.settings.inclusionList);
   const [exclusionList, setExclusionList] = useState<string>(user.settings.exclusionList);

   useEffect(() => {
      console.log(user);

      console.log(
         JSON.stringify({
            username: user.username,
            memberList: members,
            previousJos: jos,
            inclusionList: inclusionList,
            exclusionList: exclusionList,
         })
      );

      fetch("/api/jomaker/update-user", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            username: user.username,
            memberList: members,
            previousJos: jos,
            inclusionList: inclusionList,
            exclusionList: exclusionList,
         }),
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [jos, inclusionList, exclusionList, members]);

   function parseConditionList(list: string): string[][] {
      const conditions: string[] = list.split(/\s?(?![^]*\))/);
      conditions.forEach((condition, idx) => (conditions[idx] = condition.substring(1, condition.length - 1)));
      const conditionArray: string[][] = [];
      for (let i = 0; i < conditions.length; i++) {
         conditionArray.push(conditions[i].split(","));
         conditionArray[i].forEach((x, idx) => (conditionArray[i][idx] = x.trim()));
      }
      return conditionArray;
   }

   function createJos(): void {
      const mems: member[] = [...members];
      const activeMems: member[] = mems.filter((mem: member) => mem.active);
      const incList: string[][] = parseConditionList(inclusionList);
      const excList: string[][] = parseConditionList(exclusionList);
      let jos: member[][] = [];
      if (useAlgorithm) jos = createDiversifiedJos(numJos, activeMems, incList, excList);
      else jos = turntableAssign(numJos, activeMems);
      setJos(jos);

      // post request inclusion lists
   }

   return (
      <Box sx={{ flexGrow: 1, backgroundColor: "#a9a9a9" }}>
         <AppBar position="static">
            <Toolbar variant="dense">
               <Typography variant="h4" color="inherit" component="div" paddingRight={1}>
                  Jo Maker
               </Typography>
               <Typography variant="h6" color="inherit" sx={{ mt: "10px", mr: "10px" }}>
                  v{process.env.REACT_APP_VERSION}
               </Typography>
               {/* <IconButton onClick={() => (window.location.href = "https://github.com/CraftinPark/jo")} sx={{ ml: 1 }}>
                  <GitHub sx={{ color: "white" }} />
               </IconButton> */}
               <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1, mt: "10px" }}>
                  unbiased diversified team generator
               </Typography>
               <Typography variant="h6" color="inherit" sx={{ mr: "14px" }}>
                  Welcome, {user.username}
               </Typography>
               <Button
                  variant="outlined"
                  sx={{ color: "white", borderColor: "white" }}
                  onClick={() => {
                     setLoggedIn(false);
                     navigate("/jomaker/login");
                  }}
               >
                  Log out
               </Button>
            </Toolbar>
         </AppBar>
         <Grid container spacing={2} p={2}>
            <Grid item xs={12} md={6}>
               <MembersPanel members={members} setMembers={setMembers} />
            </Grid>
            <Grid item xs={12} md={6}>
               <JosPanel jos={jos} setJos={setJos}></JosPanel>
               <SettingsPanel
                  numJos={numJos}
                  setNumJos={setNumJos}
                  useAlgorithm={useAlgorithm}
                  setUseAlgorithm={setUseAlgorithm}
                  inclusionList={inclusionList}
                  setInclusionList={setInclusionList}
                  exclusionList={exclusionList}
                  setExclusionList={setExclusionList}
                  createJos={createJos}
               />
            </Grid>
         </Grid>
      </Box>
   );
}

export default App;
