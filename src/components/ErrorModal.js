import React, { useState } from 'react';
import { Modal, makeStyles, Button, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const ErrorModal = ({ errorMessage, onClose }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true); // Manage open state

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={handleClose} className={classes.modal}>
      <div className={classes.paper}>
      <Typography id="transition-modal-title" variant="h6" component="h2">
              Oops...
      </Typography>
      <Typography id="transition-modal-description" sx={{ mt: 20, mb: 5 }}>
        {errorMessage}
      </Typography><br/><br/>
        <Button variant="contained" color="primary" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default ErrorModal;