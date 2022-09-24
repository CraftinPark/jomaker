import React, { useState, Dispatch, SetStateAction } from "react";
import { Box, Typography, Paper, TextField, Select, MenuItem, Button, IconButton } from "@mui/material";
import { Delete, Add, Person, CheckBox, Clear, CheckBoxOutlineBlank } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import { sex, member } from "../util/types";
import { tableCell, tableFormCell, tableHeaderCell } from "./styles";

type MembersPanelProps = {
   members: member[];
   setMembers: Dispatch<SetStateAction<member[]>>;
};

const MembersPanel = ({ members, setMembers }: MembersPanelProps) => {
   const [name, setName] = useState<string>("");
   const [secondaryName, setSecondaryName] = useState<string>("");
   const [sex, setSex] = useState<sex>("male");
   const [year, setYear] = useState<number>(2000);
   const [leader, setLeader] = useState<boolean>(false);

   function addMember(): void {
      if (!name || !sex || !year || leader === undefined) return;
      setMembers((current) => [
         ...current,
         { id: uuidv4(), name, secondaryName: secondaryName, sex, year, leader, active: true },
      ]);
   }

   function removeMember(index: number): void {
      let mems = [...members];
      mems.splice(index, 1);
      setMembers(mems);
   }

   function editMember(index: number, property: string, update: any) {
      setMembers((current) => {
         let newMembers = [...current];
         switch (property) {
            case "name":
               newMembers[index].name = update;
               break;
            case "secondaryName":
               newMembers[index].secondaryName = update;
               break;
            case "sex":
               newMembers[index].sex = update;
               break;
            case "year":
               newMembers[index].year = update;
               break;
            case "leader":
               newMembers[index].leader = update;
               break;
         }

         return newMembers;
      });
   }

   function renderMembers(): JSX.Element {
      return (
         <Box sx={{ mt: 1, mb: 2 }}>
            <Box sx={{ display: "flex" }}>
               <Box sx={tableHeaderCell} width="6%"></Box>
               <Box sx={tableHeaderCell} width="23.5%">
                  <Typography>Name</Typography>
               </Box>
               <Box sx={tableHeaderCell} width="23.5%">
                  <Typography>Alt name</Typography>
               </Box>
               <Box sx={tableHeaderCell} width="14%">
                  <Typography>Sex</Typography>
               </Box>
               <Box sx={tableHeaderCell} width="14%">
                  <Typography>Year</Typography>
               </Box>
               <Box sx={tableHeaderCell} width="14%">
                  <Typography>Leader</Typography>
               </Box>
               <Box sx={tableHeaderCell} width="5%"></Box>
            </Box>
            {members.map((member, index) => (
               <Box
                  key={member.id}
                  sx={{ display: "flex", height: "37px", backgroundColor: member.active ? "lightgreen" : "white" }}
               >
                  <Box sx={tableCell} width="6%">
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
                        {member.active ? <CheckBox style={{ color: "green" }} /> : <CheckBoxOutlineBlank />}
                     </button>
                  </Box>
                  <Box sx={tableCell} width="23.5%">
                     <TextField
                        inputProps={{ style: { textAlign: "center" } }}
                        required
                        size="small"
                        value={member.name}
                        onChange={(e: any) => editMember(index, "name", e.target.value)}
                     />
                  </Box>
                  <Box sx={tableCell} width="23.5%">
                     <TextField
                        inputProps={{ style: { textAlign: "center" } }}
                        required
                        size="small"
                        value={member.secondaryName}
                        onChange={(e: any) => editMember(index, "secondaryName", e.target.value)}
                     />
                  </Box>
                  <Box sx={tableCell} width="14%">
                     <Select
                        SelectDisplayProps={{ style: { color: member.sex === "male" ? "blue" : "deeppink" } }}
                        fullWidth
                        size="small"
                        value={member.sex}
                        onChange={(e: any) => editMember(index, "sex", e.target.value)}
                     >
                        <MenuItem value={"male"}>M</MenuItem>
                        <MenuItem value={"female"}>F</MenuItem>
                     </Select>
                  </Box>
                  <Box sx={tableCell} width="14%">
                     <TextField
                        inputProps={{
                           style: {
                              backgroundColor: "transparent",
                              outline: "none",
                              border: "none",
                              height: "100%",
                              fontSize: "16px",
                              textAlign: "center",
                           },
                        }}
                        required
                        placeholder="Year"
                        type="number"
                        size="small"
                        value={member.year}
                        onChange={(e: any) => editMember(index, "year", e.target.value)}
                     />
                  </Box>
                  <Box sx={tableCell} width="14%">
                     <Select
                        inputProps={{
                           style: {
                              backgroundColor: "transparent",
                              outline: "none",
                              border: "none",
                              WebkitAppearance: "none",
                              width: "100%",
                              height: "100%",
                              fontSize: "18px",
                              textAlign: "center",
                           },
                        }}
                        fullWidth
                        size="small"
                        value={member.leader.toString()}
                        onChange={(e: any) =>
                           e.target.value === "true"
                              ? editMember(index, "leader", true)
                              : editMember(index, "leader", false)
                        }
                     >
                        <MenuItem value={"true"} style={{ justifyContent: "center" }}>
                           <div style={{ display: "flex", alignItems: "center" }}>
                              <Person fontSize="small" style={{ color: "green" }} />
                           </div>
                        </MenuItem>

                        <MenuItem value={"false"} style={{ justifyContent: "center" }}>
                           <div style={{ display: "flex", alignItems: "center" }}>
                              <Clear style={{ opacity: "20%" }} fontSize="small" />
                           </div>
                        </MenuItem>
                     </Select>
                  </Box>
                  <Box sx={{ ...tableCell, backgroundColor: "gainsboro" }} width="5%">
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
            <Box sx={tableFormCell} width="6%"></Box>
            <Box sx={tableFormCell} width="23.5%">
               <TextField
                  required
                  placeholder="Name"
                  size="small"
                  value={name}
                  fullWidth
                  onChange={(e: any) => setName(e.target.value)}
               />
            </Box>
            <Box sx={tableFormCell} width="23.5%">
               <TextField
                  required
                  placeholder="Alt name"
                  size="small"
                  value={secondaryName}
                  fullWidth
                  onChange={(e: any) => setSecondaryName(e.target.value)}
               />
            </Box>
            <Box sx={tableFormCell} width="14%">
               <Select fullWidth size="small" value={sex} onChange={(e: any) => setSex(e.target.value)}>
                  <MenuItem value={"male"}>M</MenuItem>
                  <MenuItem value={"female"}>F</MenuItem>
               </Select>
            </Box>
            <Box sx={tableFormCell} width="14%">
               <TextField
                  required
                  placeholder="Year"
                  type="number"
                  size="small"
                  value={year}
                  onChange={(e: any) => setYear(e.target.value)}
               />
            </Box>
            <Box sx={tableFormCell} width="14%">
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
            <Box sx={tableFormCell} width="5%">
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
