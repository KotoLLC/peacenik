import React, { useCallback, useState } from "react";
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

import { AttachmentButton, DMInFooterWrapper } from "../styles";
import { Visibility } from "@material-ui/icons";
import { UploadInput } from "@view/shared/styles";
import { ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { ApiTypes } from "src/types";
import Actions from "@store/actions";

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
  const [isFileUploaded, setIsFileUploaded] = useState<boolean>(false);

  const dispatch = useDispatch();
  // onGetMessageUploadLink: (data: ApiTypes.Feed.UploadLinkRequest) => dispatch(Actions.feed.getFeedMessageUploadLinkRequest(data))
  const handleImageFileUpload = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const onGetUploadLink = (value: ApiTypes.Profile.UploadLinkRequest) =>
        dispatch(Actions.profile.getUploadLinkRequest(value));

      setIsFileUploaded(false);

      const file = event.target.files;

      if (file && file[0]) {
        onGetUploadLink({
          content_type: file[0].type,
          file_name: file[0].name,
        });

        // const self = this;

        /* tslint:disable */
        // loadImage(
        //   file[0],
        //   function (img, data) {
        //     if (data.imageHead && data.exif) {
        //       // Reset Exif Orientation data:
        //       loadImage.writeExifData(data.imageHead, data, "Orientation", 1);
        //       img.toBlob(function (blob) {
        //         loadImage.replaceHead(blob, data.imageHead, function (newBlob) {
        //           self.setState({
        //             file: newBlob,
        //           });
        //         });
        //       }, "image/jpeg");
        //     } else {
        //       self.setState({
        //         file: file[0],
        //       });
        //     }
        //   },
        //   { meta: true, orientation: true, canvas: true }
        // );
        /* tslint:enable */
      }
    },
    [dispatch]
  );

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
              <AttachmentButton>
                <PhotoCameraOutlinedIcon />
                <UploadInput
                  type="file"
                  name="attached_image"
                  onChange={handleImageFileUpload}
                  accept="image/x-png,image/gif,image/jpeg"
                />
              </AttachmentButton>
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
