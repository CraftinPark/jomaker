import { Button, Divider, Grid, Paper, Slider, Switch, TextField, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

type SettingsPanelProps = {
   numJos: number;
   setNumJos: Dispatch<SetStateAction<number>>;
   useAlgorithm: boolean;
   setUseAlgorithm: Dispatch<SetStateAction<boolean>>;
   inclusionList: string;
   setInclusionList: Dispatch<SetStateAction<string>>;
   exclusionList: string;
   setExclusionList: Dispatch<SetStateAction<string>>;
   createJos: () => void;
};

const SettingsPanel = ({
   numJos,
   setNumJos,
   useAlgorithm,
   setUseAlgorithm,
   inclusionList,
   setInclusionList,
   exclusionList,
   setExclusionList,
   createJos
}: SettingsPanelProps) => {
   return (
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
               <Switch defaultChecked value={useAlgorithm} onChange={(e: any) => setUseAlgorithm(e.target.checked)} />
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
         {/* <Typography display="inline" variant="subtitle2">
            In order of importance (WIP)
         </Typography>
         <Switch disabled /> */}
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
         {/* <Typography display="inline" variant="subtitle2">
            In order of importance (WIP)
         </Typography>
         <Switch disabled /> */}
         <Divider light />
         <Button sx={{ mt: 1, mr: 2 }} variant="contained" onClick={() => createJos()}>
            Create New Jos
         </Button>
      </Paper>
   );
};

export default SettingsPanel;
