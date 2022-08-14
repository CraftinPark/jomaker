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
} from "@mui/material";
import { Person, ContentCopy } from "@mui/icons-material";
import { Droppable, Draggable, DragDropContext } from "react-beautiful-dnd";
import { member } from "../util/types";

type JosPanelProps = {
   jos: member[][];
   setJos: Dispatch<SetStateAction<member[][]>>;
};

const JosPanel = ({ jos, setJos }: JosPanelProps) => {
   const [showProperties, setShowProperties] = useState<boolean>(false);
   const [useKoreanNames, setUseKoreanNames] = useState<boolean>(false);
   const [clickedCopyJos, setClickedCopyJos] = useState<boolean>(false);

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
      const { source, destination } = result;
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

   function josToClipboard(jos: member[][]): void {
      let josNames: string = jos
         .map((jo) => jo.map((member) => (useKoreanNames ? member.kName : member.name) + " ").join("\n"))
         .join("\n\n");
      navigator.clipboard.writeText(josNames);
   }

   function joToClipboard(jo: member[]): void {
      let joNames: string = jo.map((member) => (useKoreanNames ? member.kName : member.name) + " ").join("\n");
      navigator.clipboard.writeText(joNames);
   }

   function RenderJo({ jo, index }: { jo: member[]; index: number }): JSX.Element {
      const [clickedCopyJo, setClickedCopyJos] = useState<boolean>(false);

      return (
         <Grid item xs={12} sm={6} lg={4}>
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
               <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
         </Grid>
      );
   }

   function renderJoMember(member: member, index: number): JSX.Element {
      const detailedJoMember = (
         <Grid container spacing={0}>
            <Grid item xs={6} justifyContent="center">
               <Typography>{useKoreanNames ? member.kName : member.name}</Typography>
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
            <Typography>{useKoreanNames ? member.kName : member.name}</Typography>
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
                  <RenderJo key={index} jo={jo} index={index} />
               ))}
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
               <FormControlLabel
                  control={<Switch value={useKoreanNames} onChange={(e: any) => setUseKoreanNames(e.target.checked)} />}
                  label="Use Korean Names"
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
