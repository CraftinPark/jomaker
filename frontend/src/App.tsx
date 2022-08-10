import {
   AppBar,
   Box,
   Button,
   FormControlLabel,
   Grid,
   MenuItem,
   Paper,
   Select,
   Slider,
   Switch,
   TextField,
   Toolbar,
   Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { member, sex, createDiversifiedJos, shuffleMembers, turntableAssign, calculateTotalScore } from "./joMaker";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";

function App() {
   const [members, setMembers] = useState<member[]>(() => {
      const localData = localStorage.getItem("members");
      return localData ? JSON.parse(localData) : [];
   });

   useEffect(() => {
      localStorage.setItem("members", JSON.stringify(members));
   }, [members]);

   const [name, setName] = useState<string>("");
   const [sex, setSex] = useState<sex>("male");
   const [year, setYear] = useState<number>(2000);
   const [leader, setLeader] = useState<boolean>(false);

   const [numJos, setNumJos] = useState<number>(3);
   const [useAlgorithm, setUseAlgorithm] = useState<boolean>(true);

   const [inclusionList, setInclusionList] = useState<string>((): string => {
      const localData = localStorage.getItem("inclusionList");
      return localData ? localData : "";
   });

   useEffect(() => {
      localStorage.setItem("inclusionList", inclusionList);
   }, [inclusionList]);

   const [exclusionList, setExclusionList] = useState<string>((): string => {
      const localData = localStorage.getItem("exclusionList");
      return localData ? localData : "";
   });

   useEffect(() => {
      localStorage.setItem("exclusionList", exclusionList);
   }, [exclusionList]);

   const [jos, setJos] = useState<member[][]>([]);

   useEffect(() => {
      console.log(jos);
   }, [jos]);

   const [showProperties, setShowProperties] = useState<boolean>(false);

   function renderMembers() {
      let tableStyle = {
         backgroundColor: "white",
         outlineStyle: "solid",
         display: "flex",
         justifyContent: "center",
         alignItems: "center",
      };

      let tableHeaderStyle = {
         backgroundColor: "gray",
         outlineStyle: "solid",
         display: "flex",
         justifyContent: "center",
         alignItems: "center",
      };

      return (
         <Box sx={{ mt: 1, mb: 2 }}>
            <Box sx={{ display: "flex" }}>
               <Box sx={tableHeaderStyle} width="22.5%">
                  <Typography>Name</Typography>
               </Box>
               <Box sx={tableHeaderStyle} width="22.5%">
                  <Typography>Sex</Typography>
               </Box>
               <Box sx={tableHeaderStyle} width="22.5%">
                  <Typography>Year</Typography>
               </Box>
               <Box sx={tableHeaderStyle} width="22.5%">
                  <Typography>Leader</Typography>
               </Box>
               <Box sx={tableHeaderStyle} width="10%">
                  <Typography>Remove</Typography>
               </Box>
            </Box>
            {members.map((member, index) => {
               return (
                  <Box sx={{ display: "flex" }}>
                     <Box sx={tableStyle} width="22.5%">
                        <Typography>{member.name}</Typography>
                     </Box>
                     <Box sx={tableStyle} width="22.5%">
                        <Typography>{member.sex}</Typography>
                     </Box>
                     <Box sx={tableStyle} width="22.5%">
                        <Typography>{member.year}</Typography>
                     </Box>
                     <Box sx={tableStyle} width="22.5%">
                        <Typography>{member.leader ? "true" : "false"}</Typography>
                     </Box>
                     <Box sx={tableStyle} width="10%">
                        <Button onClick={() => removeMember(index)}>x</Button>
                     </Box>
                  </Box>
               );
            })}
         </Box>
      );
   }

   function removeMember(index: number) {
      console.log(index);
      let mems = [...members];
      mems.splice(index, 1);
      setMembers(mems);
   }

   function memberAdder() {
      let tableStyle = {
         display: "flex",
         justifyContent: "center",
         alignItems: "center",
      };
      return (
         <Box sx={{ display: "flex" }}>
            <Box sx={tableStyle} width="22.5%">
               <TextField
                  required
                  placeholder="Name"
                  size="small"
                  value={name}
                  onChange={(e: any) => setName(e.target.value)}
               ></TextField>
            </Box>
            <Box sx={tableStyle} width="22.5%">
               <Select fullWidth size="small" value={sex} onChange={(e: any) => setSex(e.target.value)}>
                  <MenuItem value={"male"}>male</MenuItem>
                  <MenuItem value={"female"}>female</MenuItem>
               </Select>
            </Box>
            <Box sx={tableStyle} width="22.5%">
               <TextField
                  required
                  placeholder="Year"
                  type="number"
                  size="small"
                  value={year}
                  onChange={(e: any) => setYear(e.target.value)}
               ></TextField>
            </Box>
            <Box sx={tableStyle} width="22.5%">
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
            <Box sx={tableStyle} width="10%">
               <Button variant="contained" onClick={() => addMember()}>
                  Add
               </Button>
            </Box>
         </Box>
      );
   }

   function addMember() {
      if (!name || !sex || !year || leader === undefined) return;
      setMembers((current) => [...current, { id: uuidv4(), name: name, sex: sex, year: year, leader: leader }]);
   }

   function parseList(list: string) {
      let inclist = list;
      let incs = inclist.split(/\,\s?(?![^\(]*\))/);
      incs.forEach((inc, idx) => (incs[idx] = inc.substring(1, inc.length - 1)));
      let is: string[][] = [];
      for (let i = 0; i < incs.length; i++) {
         is.push([]);
         is[i] = incs[i].split(",");
         is[i].forEach((x, idx) => (is[i][idx] = x.trim()));
      }
      return is;
   }

   function createJos() {
      let mems = [...members];
      shuffleMembers(mems);
      let incList = parseList(inclusionList);
      let excList = parseList(exclusionList);
      let jos: member[][] = [];
      if (useAlgorithm) jos = createDiversifiedJos(numJos, mems, incList, excList);
      else jos = turntableAssign(numJos, mems);
      setJos(jos);
      console.log(calculateTotalScore(jos, incList, excList));
   }

   const reorder = (list: any, startIndex: any, endIndex: any): member[] => {
      const result: member[] = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);

      return result;
   };

   const move = (source: member[], destination: member[], droppableSource: any, droppableDestination: any) => {
      const sourceClone = Array.from(source);
      const destClone = Array.from(destination);
      const [removed] = sourceClone.splice(droppableSource.index, 1);

      destClone.splice(droppableDestination.index, 0, removed);

      const result: member[][] = [...jos];
      console.log("id");
      console.log(droppableSource.droppableId, droppableDestination.droppableId);
      result[droppableSource.droppableId] = sourceClone;
      result[droppableDestination.droppableId] = destClone;

      console.log("result");
      console.log(result);

      return result;
   };

   const onDragEnd = (result: any) => {
      const { source, destination } = result;

      // dropped outside the list
      if (!destination) return;

      if (source.droppableId === destination.droppableId) {
         setJos((prev) => {
            let jos = [...prev];
            jos[parseInt(source.droppableId)] = reorder(
               prev[parseInt(source.droppableId)],
               source.index,
               destination.index
            );
            return jos;
         });
      } else {
         const result: member[][] = move(
            jos[parseInt(source.droppableId)],
            jos[parseInt(destination.droppableId)],
            source,
            destination
         );

         setJos(result);
      }
   };
   // const onDragEnd = (result: any) => {
   //    console.log(result);
   //    setJos((prev) => {
   //       let jos = [...prev];
   //       jos[0] = reorder(prev[0], result.source.index, result.destination.index);
   //       return jos;
   //    });
   // };

   function renderJos() {
      return (
         <DragDropContext onDragEnd={onDragEnd}>
            <Grid container minHeight={150}>
               {jos.map((jo, index) => (
                  <Grid item xs={showProperties ? 6 : 4}>
                     <Paper sx={{ m: 1, p: 1, backgroundColor: "lightblue" }}>
                        <Droppable droppableId={index.toString()}>
                           {(provided, snapshot) => (
                              <div ref={provided.innerRef}>
                                 {jo.map((member, index) => (
                                    <Draggable draggableId={member.id} key={member.id} index={index}>
                                       {(provided, snapshot) => (
                                          <div
                                             ref={provided.innerRef}
                                             {...provided.draggableProps}
                                             {...provided.dragHandleProps}
                                          >
                                             <Box>
                                                <div
                                                   style={{
                                                      display: "flex",
                                                      backgroundColor: "transparent",
                                                      padding: "5px",
                                                      alignItems: "center",
                                                   }}
                                                >
                                                   {renderJoMember(member)}
                                                </div>
                                             </Box>
                                          </div>
                                       )}
                                    </Draggable>
                                 ))}
                                 {provided.placeholder}
                              </div>
                           )}
                        </Droppable>
                     </Paper>
                  </Grid>
               ))}
            </Grid>
         </DragDropContext>
      );
      // return (
      //    <Grid container>
      //       {jos.map((jo) => {
      //          return (
      //             <Grid item xs={6}>
      //                <Paper sx={{ m: 1, p: 1, backgroundColor: "lightblue" }}>
      //                   {jo.map((member) => (
      //                      <Box sx={{ display: "flex" }}>
      //                         <Box width="35%">
      //                            <Typography>{member.name}</Typography>
      //                         </Box>
      //                         <Box width="25%">
      //                            <Typography style={{ color: member.sex === "male" ? "blue" : "DeepPink" }}>
      //                               {member.sex}
      //                            </Typography>
      //                         </Box>
      //                         <Box width="25%">
      //                            <Typography color="secondary">{member.year}</Typography>
      //                         </Box>
      //                         <Box width="15%">
      //                            <Typography style={{ color: member.leader ? "green" : "red" }}>
      //                               {member.leader ? "true" : "false"}
      //                            </Typography>
      //                         </Box>
      //                      </Box>
      //                   ))}
      //                </Paper>
      //             </Grid>
      //          );
      //       })}
      //    </Grid>
      // );
   }

   function renderJoMember(member: member) {
      if (showProperties) {
         return (
            <div
               style={{
                  display: "flex",
                  backgroundColor: "#cbeef2",
                  padding: "5px",
                  borderRadius: "5px",
                  width: "100%",
               }}
            >
               <Box width="35%">
                  <Typography>{member.name}</Typography>
               </Box>
               <Box width="25%">
                  <Typography
                     style={{
                        color: member.sex === "male" ? "blue" : "DeepPink",
                     }}
                  >
                     {member.sex}
                  </Typography>
               </Box>
               <Box width="25%">
                  <Typography color="secondary">{member.year}</Typography>
               </Box>
               <Box width="15%">
                  <Typography style={{ color: member.leader ? "green" : "red" }}>
                     {member.leader ? "true" : "false"}
                  </Typography>
               </Box>
            </div>
         );
      } else {
         return (
            <div
               style={{
                  display: "flex",
                  backgroundColor: "#cbeef2",
                  padding: "5px",
                  borderRadius: "5px",
                  width: "100%",
                  justifyContent: "center",
               }}
            >
               <Box>
                  <Typography>{member.name}</Typography>
               </Box>
            </div>
         );
      }
   }

   return (
      <Box sx={{ flexGrow: 1 }}>
         <AppBar position="static">
            <Toolbar variant="dense">
               <Typography variant="h6" color="inherit" component="div">
                  Jo Maker
               </Typography>
            </Toolbar>
         </AppBar>
         <Grid container spacing={2} p={2}>
            <Grid item xs={6}>
               <Paper sx={{ p: 2, backgroundColor: "Gainsboro" }}>
                  <Typography variant="h6">Members:</Typography>
                  <Box>{renderMembers()}</Box>
                  {memberAdder()}
               </Paper>
            </Grid>
            <Grid item xs={6}>
               <Paper sx={{ mb: 2, p: 2, backgroundColor: "Gainsboro" }}>
                  <Typography variant="h6">Jos:</Typography>
                  {renderJos()}
                  <Button sx={{ mt: 1, mr: 2 }} variant="contained" onClick={() => createJos()}>
                     Create New Jos
                  </Button>
                  <FormControlLabel
                     control={
                        <Switch
                           value={showProperties}
                           onChange={(e: any) => setShowProperties(e.target.checked)}
                        ></Switch>
                     }
                     label="Show Properties"
                  />
               </Paper>
               <Paper sx={{ p: 2, backgroundColor: "Gainsboro" }}>
                  <Typography variant="h6">Settings:</Typography>
                  <Typography variant="subtitle1">Number of Jos:</Typography>
                  <Slider
                     aria-label="Number of Jos"
                     defaultValue={4}
                     value={numJos}
                     onChange={(e: any) => setNumJos(e.target.value)}
                     valueLabelDisplay="auto"
                     step={1}
                     min={2}
                     max={10}
                  />
                  <Typography variant="subtitle1">Use Diversifier Algorithm:</Typography>
                  <Switch
                     defaultChecked
                     value={useAlgorithm}
                     onChange={(e: any) => setUseAlgorithm(e.target.checked)}
                  />
                  <Typography variant="subtitle1">Inclusion List: Members that must be grouped together</Typography>
                  <TextField
                     placeholder="surround each inclusion group with parantheses, separated by commas"
                     fullWidth
                     multiline
                     rows={1}
                     value={inclusionList}
                     onChange={(e: any) => setInclusionList(e.target.value)}
                  />
                  <Typography display="inline" variant="subtitle2">
                     In order of importance (WIP)
                  </Typography>
                  <Switch disabled />
                  <Typography sx={{ mt: 1 }} variant="subtitle1">
                     Exclusion List: Members that cannot be grouped together
                  </Typography>
                  <TextField
                     placeholder="surround each exclusion group with parantheses, separated by commas"
                     fullWidth
                     multiline
                     rows={1}
                     value={exclusionList}
                     onChange={(e: any) => setExclusionList(e.target.value)}
                  />
                  <Typography display="inline" variant="subtitle2">
                     In order of importance (WIP)
                  </Typography>
                  <Switch disabled />
               </Paper>
            </Grid>
         </Grid>
      </Box>
   );
}

export default App;
