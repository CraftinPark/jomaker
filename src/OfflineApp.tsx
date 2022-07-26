import React, { useEffect, useState } from "react";
import { AppBar, Box, Grid, IconButton, Toolbar, Typography } from "@mui/material";
import { GitHub } from "@mui/icons-material";

import { member } from "./util/types";
import { createDiversifiedJos, turntableAssign } from "./util/joMaker";

import MembersPanel from "./components/MembersPanel";
import JosPanel from "./components/JosPanel";
import SettingsPanel from "./components/SettingsPanel";
import JosDialog from "./JosDialog";
import Appbar from "./Appbar";

function OfflineApp() {
   const [members, setMembers] = useState<member[]>(() => {
      const localData = localStorage.getItem("members");
      return localData ? JSON.parse(localData) : [];
   });
   const [jos, setJos] = useState<member[][]>((): member[][] => {
      const localData = localStorage.getItem("jos");
      return localData ? JSON.parse(localData) : [];
   });
   const [numJos, setNumJos] = useState<number>(3);
   const [useAlgorithm, setUseAlgorithm] = useState<boolean>(true);
   const [inclusionList, setInclusionList] = useState<string>((): string => {
      return localStorage.getItem("inclusionList") ?? "";
   });
   const [exclusionList, setExclusionList] = useState<string>((): string => {
      return localStorage.getItem("exclusionList") ?? "";
   });
   const [parsedInclusionList, setParsedInclusionList] = useState<string[][]>([]);
   const [parsedExclusionList, setParsedExclusionList] = useState<string[][]>([]);

   const [dialogOpened, setDialogOpened] = useState<boolean>(false);

   useEffect(() => {
      localStorage.setItem("members", JSON.stringify(members));
   }, [members]);

   useEffect(() => {
      localStorage.setItem("jos", JSON.stringify(jos));
   }, [jos]);

   useEffect(() => {
      localStorage.setItem("inclusionList", inclusionList);
   }, [inclusionList]);

   useEffect(() => {
      localStorage.setItem("exclusionList", exclusionList);
   }, [exclusionList]);

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
      else jos = turntableAssign(numJos, activeMems);
      setJos(jos);
   }

   return (
      <Box sx={{ flexGrow: 1, backgroundColor: "#a9a9a9" }}>
         <Appbar offline={true} loggedIn={true}></Appbar>
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
                  setDialogOpened={setDialogOpened}
               />
            </Grid>
         </Grid>
         <JosDialog dialogOpened={dialogOpened} setDialogOpened={setDialogOpened} jos={jos} />
      </Box>
   );
}

export default OfflineApp;
