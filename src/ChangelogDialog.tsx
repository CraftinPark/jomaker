import { Dispatch, SetStateAction, useEffect } from "react";
import { Dialog, DialogContent } from "@mui/material";
import Changelog from "./ChangeLog/Changelog.jsx";

function ChangelogDialog({
    dialogOpened,
    setDialogOpened,
 }: {
    dialogOpened: boolean;
    setDialogOpened: Dispatch<SetStateAction<boolean>>;
 }) {
   useEffect(() => {

   }, [dialogOpened]);

   return(
      <Dialog
         fullWidth
         onClose={() => setDialogOpened(false)}
         open={dialogOpened}
         PaperProps={{
            sx: {
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
            },
         }}
      >
         <DialogContent>
            {Changelog()}
         </DialogContent>

      </Dialog>
   );
}

export default ChangelogDialog
