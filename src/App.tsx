import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";

import { member } from "./util/types";
import { createDiversifiedJos, shuffleMembers, turntableAssign } from "./util/joMaker";

import MembersPanel from "./components/MembersPanel";
import JosPanel from "./components/JosPanel";
import SettingsPanel from "./components/SettingsPanel";
import Appbar from "./Appbar";
import { user } from "./Main";
import JosDialog from "./JosDialog";

function App({ user }: { user: user }) {
   const [members, setMembers] = useState<member[]>(user.memberList);
   const [jos, setJos] = useState<member[][]>(user.previousJos);
   const [numJos, setNumJos] = useState<number>(3);
   const [useAlgorithm, setUseAlgorithm] = useState<boolean>(true);
   const [inclusionList, setInclusionList] = useState<string>(user.settings.inclusionList);
   const [exclusionList, setExclusionList] = useState<string>(user.settings.exclusionList);
   const [dialogOpened, setDialogOpened] = useState<boolean>(false);

   useEffect(() => {
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

      console.log("successfully sent post request ", user.username);

      localStorage.setItem(
         "user",
         JSON.stringify({
            username: user.username,
            memberList: members,
            previousJos: jos,
            inclusionList: inclusionList,
            exclusionList: exclusionList,
            settings: user.settings,
         })
      );

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
      else jos = turntableAssign(numJos, shuffleMembers(activeMems));
      setJos(jos);

      // post request inclusion lists
   }

   return (
      <Box sx={{ flexGrow: 1, backgroundColor: "#a9a9a9" }}>
         <Appbar offline={false} loggedIn={true} username={user.username}></Appbar>
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
                  setDialogOpened={setDialogOpened}
               />
            </Grid>
         </Grid>
         <JosDialog dialogOpened={dialogOpened} setDialogOpened={setDialogOpened} jos={jos}/>
      </Box>
   );
}

export default App;
