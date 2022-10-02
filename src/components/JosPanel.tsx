import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import useMeasure from "react-use-measure";
import { useSpring, animated } from "@react-spring/web";
import { member } from "../util/types";
import { calculateJoScore } from "../util/joMaker";
import styles from "./styles.module.css";

type JosPanelProps = {
   jos: member[][];
   setJos: Dispatch<SetStateAction<member[][]>>;
   inclusionList: string[][];
   exclusionList: string[][];
};

const JosPanel = ({ jos, setJos, inclusionList, exclusionList }: JosPanelProps) => {
   const [showProperties, setShowProperties] = useState<boolean>(false);
   const [useSecondaryNames, setUseSecondaryNames] = useState<boolean>(false);
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
         .map((jo) => jo.map((member) => (useSecondaryNames ? member.secondaryName : member.name) + " ").join("\n"))
         .join("\n\n");
      navigator.clipboard.writeText(josNames);
   }

   function joToClipboard(jo: member[]): void {
      let joNames: string = jo
         .map((member) => (useSecondaryNames ? member.secondaryName : member.name) + " ")
         .join("\n");
      navigator.clipboard.writeText(joNames);
   }

   function RenderJo({ jo, index }: { jo: member[]; index: number }): JSX.Element {
      const [clickedCopyJo, setClickedCopyJos] = useState<boolean>(false);
      const [diversityScore, setDiversityScore] = useState<number>(0);
      const [ref, { width }] = useMeasure();
      const scoreSpring = useSpring({ width: (width / 5) * diversityScore });

      useEffect(() => {
         setDiversityScore(calculateJoScore(jo, inclusionList, exclusionList));
      }, [jo]);

      return (
         <Paper sx={{ m: 1, p: 1, backgroundColor: "lightblue" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
               <Typography sx={{ color: "steelblue" }} variant="subtitle1">
                  Jo {index + 1}
               </Typography>
               <div
                  ref={ref}
                  style={{
                     position: "relative",
                     width: "100px",
                     height: "10px",
                     borderRadius: "5px",
                     backgroundColor: "grey",
                     marginRight: "8px",
                  }}
               >
                  <animated.div
                     style={{
                        ...scoreSpring,
                        position: "absolute",
                        top: "0",
                        left: "0",
                        height: "100%",
                        borderRadius: "5px",
                        background: "yellow",
                     }}
                  />
                  <animated.div className={styles.content}>
                     <Typography>{diversityScore}</Typography>
                  </animated.div>
               </div>
            </Box>

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
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
               <FormControlLabel
                  control={
                     <Switch value={useSecondaryNames} onChange={(e: any) => setUseSecondaryNames(e.target.checked)} />
                  }
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
