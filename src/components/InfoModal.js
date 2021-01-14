//////////////////////////////////////////////////////////////////////////////////////
///     This Component is almost completely the Modal example from the Material-UI page, with slight
///     modifications so that it would fit within my app
//////////////////////////////////////////////////////////////////////////////////////

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: "#393e46",
    color: "#EEEEEE",
    border: '2px solid #222831',
    outline: 'none',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


export default function InfoModal() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <i onClick={handleOpen} className="fa fa-question" style={{marginRight: '25px', float:'right', display: 'inline', position:"relative", top:"-36px"}} ></i>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title" style={{textAlign: "center"}}>How to use the Marble Testing Support App</h2>
            <hr style={{height: "12px", border: "0", boxShadow: "inset 0 12px 12px -12px rgba(0, 0, 0, 0.5)"}}></hr>
            <p style={{textAlign: "center"}}>
                Testers can use multiple search parameters to find <br/> 
                specific tests that have failed in the past, enter <br/> 
                notes on how to repair the issues, and find old fixes <br/> 
                to quicken the time it takes to troubleshoot failures. <br/> 
                <hr style={{height: "12px", border: "0", boxShadow: "inset 0 12px 12px -12px rgba(0, 0, 0, 0.5)"}}></hr>
                Clicking on a test will expand its information, clicking <br/>
                on it again will collapse it.
            </p>
            <hr style={{height: "12px", border: "0", boxShadow: "inset 0 12px 12px -12px rgba(0, 0, 0, 0.5)"}}></hr>
            <p>
            <i style={{display: 'inline'}} className="fa fa-times"></i> {" "} - A red cross indicates that a test resulted in failure
            </p>
            <p>
            <i style={{display: 'inline'}} className="fa fa-check"></i> - A green checkmark indicates that a test passed
            </p>
            <p>
            <i style={{display: 'inline'}} className="fa fa-comment"></i> - A white bubble to the right of the test indicates that <br/> <span style={{paddingLeft:'45px'}}>it contains a note</span>
            </p>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
