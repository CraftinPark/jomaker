import React, { useState, Dispatch, SetStateAction } from "react";
import { Box, Typography, Paper, TextField, Select, MenuItem, Button, IconButton } from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import { sex, member } from "../util/types";
import { tableCell, tableFormCell, tableHeaderCell } from "./styles";

type MembersPanelProps = {
   members: member[];
   setMembers: Dispatch<SetStateAction<member[]>>;
};

const MembersPanel = ({ members, setMembers }: MembersPanelProps) => {
   const [name, setName] = useState<string>("");
   const [kName, setKName] = useState<string>("");
   const [sex, setSex] = useState<sex>("male");
   const [year, setYear] = useState<number>(2000);
   const [leader, setLeader] = useState<boolean>(false);

   function addMember(): void {
      if (!name || !kName || !sex || !year || leader === undefined) return;
      setMembers((current) => [...current, { id: uuidv4(), name, kName: kName, sex, year, leader, active: true }]);
   }

   function removeMember(index: number): void {
      let mems = [...members];
      mems.splice(index, 1);
      setMembers(mems);
   }

   function renderMembers(): JSX.Element {
      return (
         <Box sx={{ mt: 1, mb: 2 }}>
            <Box sx={{ display: "flex" }}>
               <Box sx={tableHeaderCell} width="24.5%">
                  <Typography>Name</Typography>
               </Box>
               <Box sx={tableHeaderCell} width="24.5%">
                  <Typography>이름</Typography>
               </Box>
               <Box sx={tableHeaderCell} width="15%">
                  <Typography>Sex</Typography>
               </Box>
               <Box sx={tableHeaderCell} width="15%">
                  <Typography>Year</Typography>
               </Box>
               <Box sx={tableHeaderCell} width="15%">
                  <Typography>Leader</Typography>
               </Box>
               <Box sx={tableHeaderCell} width="6%"></Box>
            </Box>
            {members.map((member, index) => (
               <Box key={member.id} sx={{ display: "flex", backgroundColor: member.active ? "lightgreen" : "white" }}>
                  <Box sx={tableCell} width="24.5%">
                     <button
                        style={{
                           background: "none",
                           color: "inherit",
                           border: "none",
                           padding: 0,
                           font: "inherit",
                           cursor: "pointer",
                           outline: "none",
                           width: "100%",
                           height: "100%",
                        }}
                        onClick={() => {
                           setMembers((prev: member[]) => {
                              const updateMember = prev[index];
                              updateMember.active = !updateMember.active;
                              const newMembers = [...prev];
                              newMembers[index] = updateMember;
                              return newMembers;
                           });
                        }}
                     >
                        <Typography>{member.name}</Typography>
                     </button>
                  </Box>
                  <Box sx={tableCell} width="24.5%">
                     <button
                        style={{
                           background: "none",
                           color: "inherit",
                           border: "none",
                           padding: 0,
                           font: "inherit",
                           cursor: "pointer",
                           outline: "none",
                           width: "100%",
                           height: "100%",
                        }}
                        onClick={() => {
                           setMembers((prev: member[]) => {
                              const updateMember = prev[index];
                              updateMember.active = !updateMember.active;
                              const newMembers = [...prev];
                              newMembers[index] = updateMember;
                              return newMembers;
                           });
                        }}
                     >
                        <Typography>{member.kName}</Typography>
                     </button>
                  </Box>
                  <Box sx={tableCell} width="15%">
                     <Typography>{member.sex}</Typography>
                  </Box>
                  <Box sx={tableCell} width="15%">
                     <Typography>{member.year}</Typography>
                  </Box>
                  <Box sx={tableCell} width="15%">
                     <Typography>{member.leader ? "true" : "false"}</Typography>
                  </Box>
                  <Box sx={{ ...tableCell, backgroundColor: "gainsboro" }} width="6%">
                     <IconButton onClick={() => removeMember(index)}>
                        <Delete />
                     </IconButton>
                  </Box>
               </Box>
            ))}
         </Box>
      );
   }

   function newMemberForm(): JSX.Element {
      return (
         <Box sx={{ display: "flex" }}>
            <Box sx={tableFormCell} width="24.5%">
               <TextField
                  required
                  placeholder="Name"
                  size="small"
                  value={name}
                  onChange={(e: any) => setName(e.target.value)}
               />
            </Box>
            <Box sx={tableFormCell} width="24.5%">
               <TextField
                  required
                  placeholder="이름"
                  size="small"
                  value={kName}
                  onChange={(e: any) => setKName(e.target.value)}
               />
            </Box>
            <Box sx={tableFormCell} width="15%">
               <Select fullWidth size="small" value={sex} onChange={(e: any) => setSex(e.target.value)}>
                  <MenuItem value={"male"}>male</MenuItem>
                  <MenuItem value={"female"}>female</MenuItem>
               </Select>
            </Box>
            <Box sx={tableFormCell} width="15%">
               <TextField
                  required
                  placeholder="Year"
                  type="number"
                  size="small"
                  value={year}
                  onChange={(e: any) => setYear(e.target.value)}
               />
            </Box>
            <Box sx={tableFormCell} width="15%">
               <Select
                  fullWidth
                  size="small"
                  value={leader.toString()}
                  onChange={(e: any) => (e.target.value === "true" ? setLeader(true) : setLeader(false))}
               >
                  <MenuItem value={"true"}>true</MenuItem>
                  <MenuItem value={"false"}>false</MenuItem>
               </Select>
            </Box>
            <Box sx={tableFormCell} width="6%">
               <Button
                  style={{ maxWidth: "100%", minWidth: "100%", maxHeight: "100%", minHeight: "100%" }}
                  variant="contained"
                  onClick={() => addMember()}
               >
                  <Add />
               </Button>
            </Box>
         </Box>
      );
   }

   return (
      <Paper sx={{ p: 2, backgroundColor: "Gainsboro" }}>
         <Typography variant="h6">Members:</Typography>
         <Box>{renderMembers()}</Box>
         {newMemberForm()}
      </Paper>
   );
};

export default MembersPanel;
