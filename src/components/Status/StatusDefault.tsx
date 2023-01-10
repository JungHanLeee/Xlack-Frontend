import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import "react-dropdown/style.css";
import Dropdown from "react-dropdown";
import styled from "styled-components";
import { Paper } from "@material-ui/core";

const StatusDefault = () => {
  const [open, setOpen] = React.useState(false);
  const handleClickToOpen = async () => {
    setOpen(true);
  };

  const handleToClose = async () => {
    setOpen(false);
  };
  const options = ["📆 In a meeting", "🚗 Communicating", "🤒 Sick", "vacationing", "working remotely", "customize"];
  const times = ["1 hour", "2 hour", "3 hour"];
  const defaultOption = options[0];
  const defaultTime = times[0];
  const Status = [];
  for (let i = 0; i < 6; i++) {
    Status.push(<StatusButton onClick={handleClickToOpen}>{options[i]}</StatusButton>);
  }
  return (
    <div>
      {Status}
      <Dialog fullWidth={true} open={open} onClose={handleToClose} PaperComponent={StyledPaper}>
        <DialogTitle>{"Set a status(Manual)"}</DialogTitle>
        <DialogContent>
          <DialogContentText>Manual</DialogContentText>
        </DialogContent>
        <Dropdown options={options} value={defaultOption} />
        <br />
        <Dropdown options={times} value={defaultTime} />
        <DialogActions>
          <Button onClick={handleToClose} color="primary" autoFocus>
            Save
          </Button>
          <Button onClick={handleToClose} color="secondary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StatusDefault;

const StyledPaper = styled(Paper)`
  & {
    background-color: aliceblue;
    width: 600px;
    border-radius: 10px;
  }
`;

const StatusButton = styled.button`
  width: 600px;
  height: 40px;
  background-color: aliceblue;
  border: none;
  text-align: left;
  font-size: 20px;
  :hover {
    background-color: cornflowerblue;
  }
`;
