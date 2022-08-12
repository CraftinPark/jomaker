import {
   AppBar,
   Box,
   Button,
   ClickAwayListener,
   Divider,
   FormControlLabel,
   Grid,
   IconButton,
   MenuItem,
   Paper,
   Select,
   Slider,
   Switch,
   TextField,
   Toolbar,
   Tooltip,
   Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Person, ContentCopy } from "@mui/icons-material";
import { member, sex, createDiversifiedJos, shuffleMembers, turntableAssign, calculateTotalScore } from "./joMaker";
import { DragDropContext, Droppable, Draggable, DroppableProps } from "react-beautiful-dnd";
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

   const [jos, setJos] = useState<member[][]>((): member[][] => {
      const localData = localStorage.getItem("jos");
      return localData ? JSON.parse(localData) : [];
   });

   useEffect(() => {
      localStorage.setItem("jos", JSON.stringify(jos));
   }, [jos]);

   const [showProperties, setShowProperties] = useState<boolean>(false);

   function renderMembers() {
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
               let tableStyle = {
                  backgroundColor: member.active ? "lightgreen" : "white",
                  outlineStyle: "solid",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
               };
               return (
                  <Box sx={{ display: "flex", backgroundColor: "lightgreen" }}>
                     <Box sx={tableStyle} width="22.5%">
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
                              setMembers((prev) => {
                                 let updateMember = prev[index];
                                 updateMember.active = !updateMember.active;
                                 let newMembers = [...prev];
                                 newMembers[index] = updateMember;
                                 return newMembers;
                              });
                           }}
                        >
                           <Typography>{member.name}</Typography>
                        </button>
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
      setMembers((current) => [
         ...current,
         { id: uuidv4(), name: name, sex: sex, year: year, leader: leader, active: true },
      ]);
   }

   function parseList(list: string) {
      let inclist = list;
      let incs = inclist.split(/\s?(?![^]*\))/);
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
      let activeMems = mems.filter((mem) => mem.active);
      shuffleMembers(activeMems);
      let incList = parseList(inclusionList);
      let excList = parseList(exclusionList);
      let jos: member[][] = [];
      if (useAlgorithm) jos = createDiversifiedJos(numJos, activeMems, incList, excList);
      else jos = turntableAssign(numJos, activeMems);
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

   function RenderJos() {
      const [clickedCopy, setClickedCopy] = useState<boolean>(false);

      function josToClipboard() {
         let josNames: string = jos.map((jo) => jo.map((member) => member.name).join("\n")).join("\n\n");
         navigator.clipboard.writeText(josNames);
      }

      return (
         <DragDropContext onDragEnd={onDragEnd}>
            <Grid container minHeight={150}>
               {jos.map((jo, index) => (
                  <RenderJo jo={jo} index={index}></RenderJo>
               ))}
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
               <FormControlLabel
                  control={
                     <Switch value={showProperties} onChange={(e: any) => setShowProperties(e.target.checked)}></Switch>
                  }
                  label="Show Properties"
               />
               <ClickAwayListener
                  onClickAway={() => {
                     setClickedCopy(false);
                  }}
               >
                  <Tooltip
                     PopperProps={{
                        disablePortal: true,
                     }}
                     open={clickedCopy}
                     disableFocusListener
                     disableHoverListener
                     disableTouchListener
                     title="Copied Jos!"
                     arrow
                  >
                     <IconButton>
                        <ContentCopy
                           onClick={() => {
                              setClickedCopy(true);
                              josToClipboard();
                           }}
                        ></ContentCopy>
                     </IconButton>
                  </Tooltip>
               </ClickAwayListener>
            </Box>
         </DragDropContext>
      );
   }

   function RenderJo({ jo, index }: { jo: member[]; index: number }) {
      const [clickedCopy, setClickedCopy] = useState<boolean>(false);

      function joToClipboard() {
         let joNames: string = jo.map((member) => member.name).join("\n");
         navigator.clipboard.writeText(joNames);
      }

      return (
         <Grid item xs={4}>
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
               <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <ClickAwayListener
                     onClickAway={() => {
                        setClickedCopy(false);
                     }}
                  >
                     <Tooltip
                        PopperProps={{
                           disablePortal: true,
                        }}
                        open={clickedCopy}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        title="Copied Jo!"
                        arrow
                     >
                        <IconButton
                           onClick={() => {
                              setClickedCopy(true);
                              joToClipboard();
                           }}
                           sx={{ p: 0.5 }}
                        >
                           <ContentCopy fontSize="small"></ContentCopy>
                        </IconButton>
                     </Tooltip>
                  </ClickAwayListener>
               </Box>
            </Paper>
         </Grid>
      );
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
               <Grid container spacing={0}>
                  <Grid item xs={6} justifyContent="center">
                     <Typography>{member.name}</Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ flexGrow: 1, textAlign: "center" }}>
                     <Typography style={{ color: member.sex === "male" ? "blue" : "DeepPink" }}>
                        {member.sex === "male" ? "M" : "F"}
                     </Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ flexGrow: 1, textAlign: "center" }}>
                     <Typography color="secondary">{member.year.toString().slice(2)}</Typography>
                  </Grid>
                  <Grid
                     item
                     xs={2}
                     sx={{
                        flexGrow: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                     }}
                  >
                     {member.leader ? <Person fontSize="small" style={{ color: "green" }}></Person> : ""}
                  </Grid>
               </Grid>
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
      <Box sx={{ flexGrow: 1, backgroundColor: "#a9a9a9" }}>
         <AppBar position="static">
            <Toolbar variant="dense">
               <Typography variant="h4" color="inherit" component="div" paddingRight={2}>
                  Jo Maker
               </Typography>
               <Typography variant="h6" color="inherit" component="div">
                  unbiased diversified team generator
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
               <Paper sx={{ mb: 2, p: 2, pb: 0.5, backgroundColor: "Gainsboro" }}>
                  <Typography variant="h6">Jos:</Typography>
                  {RenderJos()}
               </Paper>
               <Paper sx={{ p: 2, backgroundColor: "Gainsboro" }}>
                  <Typography variant="h6">Settings:</Typography>
                  <Grid container spacing={2}>
                     <Grid item xs={6}>
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
                     </Grid>
                     <Grid item xs={6}>
                        <Typography variant="subtitle1">Use Diversifier Algorithm:</Typography>
                        <Switch
                           defaultChecked
                           value={useAlgorithm}
                           onChange={(e: any) => setUseAlgorithm(e.target.checked)}
                        />
                     </Grid>
                  </Grid>

                  <Typography variant="subtitle1">Inclusion List:</Typography>
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
                     Exclusion List:
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
                  <Divider light />
                  <Button sx={{ mt: 1, mr: 2 }} variant="contained" onClick={() => createJos()}>
                     Create New Jos
                  </Button>
               </Paper>
            </Grid>
         </Grid>
      </Box>
   );
}

export default App;
