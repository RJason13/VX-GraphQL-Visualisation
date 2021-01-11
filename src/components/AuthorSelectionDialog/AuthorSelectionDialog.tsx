import { Dialog, DialogTitle, List, ListItem, ListItemAvatar, Avatar, ListItemText } from "@material-ui/core";
import React, { FC } from "react";

export type AuthorData = {
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    id: string;
}

type AuthorSelectionDialogProps = {
    data: AuthorData[];
    onClose: (value: string | null) => void;
    selectedValue: string | null;
    open: boolean;
}

const AuthorSelectionDialog: FC<AuthorSelectionDialogProps> = ({ data, onClose, selectedValue, open }) => {
  
    const handleClose = () => {
      onClose(selectedValue);
    };
  
    const handleListItemClick = (value: string) => {
      onClose(value);
    };
  
    return (
      <Dialog onClose={handleClose} aria-labelledby="author-selection-dialog-title" open={open}>
        <DialogTitle id="author-selection-dialog-title">Choose Author</DialogTitle>
        <List>
          { data.length === 0 ? 
                (<ListItem autoFocus button onClick={() => handleListItemClick('addAccount')}>
                    <ListItemText primary="List is empty" />
                </ListItem>) : 
                data.map((author) => (
                    <ListItem button onClick={() => handleListItemClick(author.id)} key={author.id}>
                    <ListItemAvatar>
                        <Avatar src={author.avatar} />
                    </ListItemAvatar>
                    <ListItemText primary={`${author.firstName} ${author.lastName}`} />
                    </ListItem>
                ))
          }
        </List>
      </Dialog>
    );
  }

  export default AuthorSelectionDialog;