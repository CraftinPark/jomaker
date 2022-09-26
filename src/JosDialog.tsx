import { Button, Dialog, Grid, Paper, Typography } from "@mui/material";
import { CameraAlt, Download } from "@mui/icons-material";
import { Box } from "@mui/system";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { member } from "./util/types";
// @ts-ignore
import { useScreenshot, createFileName } from "use-react-screenshot";

import { getBlobFromImageElement, copyBlobToClipboard } from "copy-image-clipboard";

const pastelColors = [
   { base: "#FF6663", light: "#FFB3B1", dark: "#B34745" },
   { base: "#FEB144", light: "#FFD8A2", dark: "#B27C30" },
   { base: "#FDFD97", light: "#FEFECB", dark: "#B1B16A" },
   { base: "#9EE09E", light: "#CFF0CF", dark: "#6F9D6F" },
   { base: "#9EC1CF", light: "#CFE0E7", dark: "#6F8791" },
   { base: "#CC99C9", light: "#E6CCE4", dark: "#8F6B8D" },
];

function JosDialog({
   dialogOpened,
   setDialogOpened,
   jos,
}: {
   dialogOpened: boolean;
   setDialogOpened: Dispatch<SetStateAction<boolean>>;
   jos: member[][];
}) {
   const imgRef = useRef<HTMLDivElement>(null);
   const clipRef = useRef<HTMLImageElement>(null);
   const [image, takeScreenShot] = useScreenshot({ type: "image/jpeg", quality: 1.0 });
   const [randomPastelColors, setRandomPastelColors] = useState<any[]>([]);

   const copyScreenshot = () => {
      getBlobFromImageElement(clipRef.current!).then((blob) => copyBlobToClipboard(blob));
   };

   const downloadScreenshot = () => {
      takeScreenShot(imgRef.current).then((image: any, { name = "jos", extension = "jpg" } = {}) => {
         const a = document.createElement("a");
         a.href = image;
         a.download = createFileName(extension, name);
         a.click();
      });
   };

   useEffect(() => {
      setRandomPastelColors(pastelColors.sort((a, b) => 0.5 - Math.random()));
      setTimeout(() => {
         if (imgRef.current) takeScreenShot(imgRef.current);
      }, 100);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [dialogOpened]);

   function RenderJo({ jo, index }: { jo: member[]; index: number }): JSX.Element {
      return (
         <Paper
            sx={{
               m: 1,
               p: 1,
               backgroundColor: randomPastelColors[index % 6].base,
               display: "flex",
               flexDirection: "column",
               alignItems: "center",
            }}
         >
            <Typography sx={{ color: randomPastelColors[index % 6].dark }} variant="subtitle1">
               Jo {index + 1}
            </Typography>
            {jo.map((member, idx) => renderJoMember(member, randomPastelColors[index % 6].light))}
         </Paper>
      );
   }

   function renderJoMember(member: member, color: string): JSX.Element {
      const simpleJoMember = (
         <Box>
            <Typography>{member.name}</Typography>
         </Box>
      );

      return (
         <div key={`${member.id}dialog`} style={{ padding: "5px", width: "100%" }}>
            <div
               style={{
                  display: "flex",
                  backgroundColor: color,
                  padding: "5px",
                  borderRadius: "5px",
                  justifyContent: "center",
               }}
            >
               {simpleJoMember}
            </div>
         </div>
      );
   }

   return (
      <Dialog
         fullWidth
         onClose={() => setDialogOpened(false)}
         open={dialogOpened}
         PaperProps={{
            sx: {
               maxWidth: "none",
               width: "78%",
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
            },
         }}
      >
         <div style={{ display: "inline-block" }}>
            <Grid ref={imgRef} container p={4} justifyContent="center">
               {jos.map((jo, index) => (
                  <Grid key={index} item xs={6} sm={4} lg={3} style={{ minWidth: "250px" }}>
                     <RenderJo jo={jo} index={index} />
                  </Grid>
               ))}
            </Grid>
         </div>
         <div style={{ display: "flex", marginBottom: "20px" }}>
            <Button
               size="small"
               variant="outlined"
               style={{ marginRight: "5px" }}
               onClick={copyScreenshot}
               startIcon={<CameraAlt />}
            >
               Copy to Clipboard
            </Button>
            <Button size="small" variant="outlined" onClick={downloadScreenshot} startIcon={<Download />}>
               Download as .jpg
            </Button>
         </div>

         <Box display={{ xs: "none", sm: "none", md: "none", lg: "none", xl: "none" }}>
            <img alt="screenshot" ref={clipRef} src={image}></img>
         </Box>
      </Dialog>
   );
}

export default JosDialog;
