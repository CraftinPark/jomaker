import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import ReactMarkdown from "react-markdown";

function ChangelogDialog({
   dialogOpened,
   setDialogOpened,
}: {
   dialogOpened: boolean;
   setDialogOpened: Dispatch<SetStateAction<boolean>>;
}) {
   const [post, setPost] = useState<string>("");

   useEffect(() => {
      const getPost = async () => {
         // @ts-ignore
         return import("./release-notes.md").then((res) => {
            fetch(res.default)
               .then((res) => res.text())
               .then((text) => setPost(text));
         });
      };
      getPost();
   }, []);

   return (
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
            <ReactMarkdown children={post}></ReactMarkdown>
         </DialogContent>
      </Dialog>
   );
}

export default ChangelogDialog;
