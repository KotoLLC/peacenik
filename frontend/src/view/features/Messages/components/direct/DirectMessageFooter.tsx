import React, { useState } from "react";
import {
  createStyles,
  IconButton,
  Input,
  InputAdornment,
  makeStyles,
  OutlinedInput,
  Theme,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import PhotoCameraOutlinedIcon from "@material-ui/icons/PhotoCameraOutlined";

import { DMInFooterWrapper } from "../styles";
import { Visibility } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderRadius: 0,
      background: "#fff",
      borderWidth: 0,
      marginRight: "15px",
      "& .MuiOutlinedInput-input": {
        padding: "0px 14px",
      },
    },
    button: {
      color: "#fff",
    },
    notchedOutline: {
      borderWidth: "0px",
      borderColor: "#43619d !important",
    },
  })
);
const DirectMessageFooter = () => {
  const [msgValue, setMsgValue] = useState("");
  const msgInputStyles = useStyles();
  return (
    <DMInFooterWrapper>
      <OutlinedInput
        classes={{
          root: msgInputStyles.root,
          notchedOutline: msgInputStyles.notchedOutline,
        }}
        type="text"
        placeholder="Write something"
        value={msgValue}
        style={{ flex: "1 0 auto" }}
        onChange={(e) => setMsgValue(e.target.value)}
        endAdornment={
          <InputAdornment position="end">
            <IconButton aria-label="toggle password visibility">
              <PhotoCameraOutlinedIcon />
            </IconButton>
          </InputAdornment>
        }
      />
      <IconButton
        className={msgInputStyles.button}
        aria-label="upload picture"
        component="span"
      >
        <SendIcon />
      </IconButton>
    </DMInFooterWrapper>
  );
};

export default DirectMessageFooter;
