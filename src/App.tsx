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
   const [parsedInclusionList, setParsedInclusionList] = useState<string[][]>([]);
   const [parsedExclusionList, setParsedExclusionList] = useState<string[][]>([]);
   const [useDialogOpened, setUseDialogOpened] = useState<boolean>(false);

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
      setParsedInclusionList(parseConditionList(inclusionList));
      setParsedExclusionList(parseConditionList(exclusionList));
      let jos: member[][] = [];
      if (useAlgorithm) jos = createDiversifiedJos(numJos, activeMems, parsedInclusionList, parsedExclusionList);
      else jos = turntableAssign(numJos, shuffleMembers(activeMems));
      setJos(jos);
   }

   return (
      <Box sx={{ flexGrow: 1, backgroundColor: "#a9a9a9" }}>
         <Appbar offline={false} loggedIn={true} username={user.username}></Appbar>
         <Grid container spacing={2} p={2}>
            <Grid item xs={12} md={6}>
               <MembersPanel members={members} setMembers={setMembers} />
            </Grid>
            <Grid item xs={12} md={6}>
               <JosPanel
                  jos={jos}
                  setJos={setJos}
                  inclusionList={parsedInclusionList}
                  exclusionList={parsedExclusionList}
               ></JosPanel>
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
                  setDialogOpened={setUseDialogOpened}
               />
            </Grid>
         </Grid>
         <JosDialog dialogOpened={useDialogOpened} setDialogOpened={setUseDialogOpened} jos={jos} />
      </Box>
   );
}

export default App;
