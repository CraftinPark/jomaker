import { Dispatch, SetStateAction, useState } from "react";
import {
   Grid,
   Box,
   Paper,
   ClickAwayListener,
   IconButton,
   Typography,
   Tooltip,
   FormControlLabel,
   Switch,
   Button,
   TextField,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { Person, ContentCopy, Delete } from "@mui/icons-material";
import { Droppable, Draggable, DragDropContext } from "react-beautiful-dnd";
import { member } from "../util/types";

type JosPanelProps = {
   jos: member[][];
   setJos: Dispatch<SetStateAction<member[][]>>;
};

const JosPanel = ({ jos, setJos }: JosPanelProps) => {
   const [showProperties, setShowProperties] = useState<boolean>(false);
   const [useSecondaryNames, setUseSecondaryNames] = useState<boolean>(false);
   const [clickedCopyJos, setClickedCopyJos] = useState<boolean>(false);
   const [tempName, setTempName] = useState(new Map<number, String | undefined>());

   // react-beautiful-dnd functions: reorder, move, onDragEnd

   const reorder = (list: any, startIndex: any, endIndex: any): member[] => {
      const result: member[] = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
   };

   const move = (
      source: member[],
      destination: member[],
      droppableSource: any,
      droppableDestination: any
   ): member[][] => {
      const sourceClone = Array.from(source);
      const destClone = Array.from(destination);
      const [removed] = sourceClone.splice(droppableSource.index, 1);
      destClone.splice(droppableDestination.index, 0, removed);
      const result: member[][] = [...jos];
      result[droppableSource.droppableId] = sourceClone;
      result[droppableDestination.droppableId] = destClone;
      return result;
   };

   const onDragEnd = (result: any): void => {
      const { source, destination, draggableId } = result;
      if (!destination) return;
      if (source.droppableId === destination.droppableId) {
         setJos((prev) => {
            const jos = [...prev];
            jos[parseInt(source.droppableId)] = reorder(
               prev[parseInt(source.droppableId)],
               source.index,
               destination.index
            );
            return jos;
         });
      } 
      else if (destination.droppableId === "garbage") {
         setJos((prev) => {
            const jos = [...prev];
            const currentJo = jos[parseInt(source.droppableId)]
            for(let i = 0; i < currentJo.length; i++){
               if(currentJo[i].id === draggableId){
                  jos[parseInt(source.droppableId)].splice(i, 1)
               }
            }
            return jos
         })
      }
      else {
         const result: member[][] = move(
            jos[parseInt(source.droppableId)],
            jos[parseInt(destination.droppableId)],
            source,
            destination
         );
         setJos(result);
      }
   };

   function josToClipboard(jos: member[][]): void {
      let josNames: string = jos
         .map((jo) => jo.map((member) => (useSecondaryNames ? member.secondaryName : member.name) + " ").join("\n"))
         .join("\n\n");
      navigator.clipboard.writeText(josNames);
   }

   function joToClipboard(jo: member[]): void {
      let joNames: string = jo.map((member) => (useSecondaryNames ? member.secondaryName : member.name) + " ").join("\n");
      navigator.clipboard.writeText(joNames);
   }

   function handleAdd(index: number, newMember: member): void {
      const newJo = jos[index].concat(newMember);
      setJos((prev) => {
         const jos = [...prev]
         jos[index] = newJo

         return jos
      });

      tempName.set(index, undefined)
   }

   function RenderJo({ jo, index }: { jo: member[]; index: number }): JSX.Element {
      const [clickedCopyJo, setClickedCopyJos] = useState<boolean>(false);

      return (
         <Paper sx={{ m: 1, p: 1, backgroundColor: "lightblue" }}>
            <Typography sx={{ color: "steelblue" }} variant="subtitle1">
               Jo {index + 1}
            </Typography>
            <Droppable droppableId={index.toString()}>
               {(provided, snapshot) => (
                  <div ref={provided.innerRef}>
                     {jo.map((member, index) => renderJoMember(member, index))}
                     {provided.placeholder}
                  </div>
               )}
            </Droppable>
            <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
               <TextField
                  required
                  placeholder="Name"
                  size="small"
                  value={tempName.get(index)}
                  sx = {{
                     width: "100px",
                     margin: "0px 5px"
                  }}
                  onChange={(e: any) => setTempName((prev) => {
                     const tempNameList = prev
                     tempNameList.set(index, e.target.value)
                     return tempNameList
                  })}
               />
               <Button sx={{
                  backgroundColor: "green",
                  color: "white",
                  height: "25px",
               }}
                  onClick={() => {
                     if (tempName.get(index) === undefined) return;
                     handleAdd(index, { id: uuidv4(), name: String(tempName.get(index)), secondaryName: "N/A", sex: "male", year: 0, leader: false, active: false })
                     }}>
                  Add
               </Button>
               <ClickAwayListener onClickAway={() => setClickedCopyJos(false)}>
                  <Tooltip
                     PopperProps={{
                        disablePortal: true,
                     }}
                     open={clickedCopyJo}
                     disableFocusListener
                     disableHoverListener
                     disableTouchListener
                     title="Copied Jo!"
                     arrow
                  >
                     <IconButton
                        onClick={() => {
                           setClickedCopyJos(true);
                           joToClipboard(jo);
                        }}
                        sx={{ p: 0.5 }}
                     >
                        <ContentCopy fontSize="small" />
                     </IconButton>
                  </Tooltip>
               </ClickAwayListener>
            </Box>
         </Paper>
      );
   }

   function renderJoMember(member: member, index: number): JSX.Element {
      const detailedJoMember = (
         <Grid container spacing={0}>
            <Grid item xs={6} justifyContent="center">
               <Typography>{useSecondaryNames ? member.secondaryName : member.name}</Typography>
            </Grid>
            <Grid item xs={2} sx={{ flexGrow: 1, textAlign: "center" }}>
               <Typography style={{ color: member.sex === "male" ? "blue" : "DeepPink" }}>
                  {member.sex === "male" ? "M" : "F"}
               </Typography>
            </Grid>
            <Grid item xs={2} sx={{ flexGrow: 1, textAlign: "center" }}>
               <Typography color="goldenrod">{member.year.toString().slice(2)}</Typography>
            </Grid>
            <Grid item xs={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
               {member.leader ? <Person fontSize="small" style={{ color: "green" }}></Person> : ""}
            </Grid>
         </Grid>
      );

      const simpleJoMember = (
         <Box>
            <Typography>{useSecondaryNames ? member.secondaryName : member.name}</Typography>
         </Box>
      );

      return (
         <Draggable draggableId={member.id} key={member.id} index={index}>
            {(provided, snapshot) => (
               <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                  <div style={{ padding: "5px" }}>
                     <div
                        style={{
                           display: "flex",
                           backgroundColor: "#cbeef2",
                           padding: "5px",
                           borderRadius: "5px",
                           justifyContent: "center",
                        }}
                     >
                        {showProperties ? detailedJoMember : simpleJoMember}
                     </div>
                  </div>
               </div>
            )}
         </Draggable>
      );
   }

   return (
      <Paper sx={{ mb: 2, p: 2, pb: 0.5, backgroundColor: "Gainsboro" }}>
         <Typography variant="h6">Jos:</Typography>
         <DragDropContext onDragEnd={onDragEnd}>
            <Grid container minHeight={150}>
               {jos.map((jo, index) => (
                  <Grid key={index} item xs={12} sm={6} lg={4}>
                     <RenderJo jo={jo} index={index} />
                  </Grid>
               ))}
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
               <Delete sx={{ color: "#d11a2a", fontSize: "3em"}} />
               <Paper sx={{margin: "0px 15px 10px", width: "210px", height: "50px", borderStyle: "solid", borderColor: "red"}}>
                  <Droppable droppableId={"garbage"} >
                     {(provided) => (
                        <div ref={provided.innerRef}>
                           
                           {provided.placeholder}
                        </div>
                     )}
                  </Droppable>
               </Paper>
               <FormControlLabel
                  control={<Switch value={useSecondaryNames} onChange={(e: any) => setUseSecondaryNames(e.target.checked)} />}
                  label="Use Alternate Names"
               />
               <FormControlLabel
                  control={<Switch value={showProperties} onChange={(e: any) => setShowProperties(e.target.checked)} />}
                  label="Show Properties"
               />
               <ClickAwayListener onClickAway={() => setClickedCopyJos(false)}>
                  <Tooltip
                     PopperProps={{
                        disablePortal: true,
                     }}
                     open={clickedCopyJos}
                     disableFocusListener
                     disableHoverListener
                     disableTouchListener
                     title="Copied Jos!"
                     arrow
                  >
                     <IconButton
                        onClick={() => {
                           setClickedCopyJos(true);
                           josToClipboard(jos);
                        }}
                     >
                        <ContentCopy />
                     </IconButton>
                  </Tooltip>
               </ClickAwayListener>
            </Box>
         </DragDropContext>
      </Paper>
   );
};

export default JosPanel;
