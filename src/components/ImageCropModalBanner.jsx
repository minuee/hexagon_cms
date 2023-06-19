

import React, { useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { makeStyles, Box, Dialog, IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { Button } from "components/materialui";

const useStyles = makeStyles((theme) => ({
  target_image: {
    "& > :first-child": {
      display: "flex",
      alignItems: "center",
      width: 800,
      height: 600,
      background: "#000",
    },
    "& img": {
      width: "100%",
      userDrag: "none",
      userSelect: "none",
      MozUserSelect: "none",
      WebkitUserDrag: "none",
      WebkitUserSelect: "none",
      MsUserSelect: "none",
    },
  },
}));

export const ImageCropModalBanner = ({ target, ratio, minWidth, setImage, onClose }) => {
  const classes = useStyles();
  const [crop, setCrop] = useState({
    unit: "px",
    width: minWidth,
    height: minWidth / ratio,
    aspect: ratio,
  });

  function getCroppedImg(crop) {
    const img = document.createElement("img");
    img.src = target.src;

    const canvas = document.createElement("canvas");
    const scale = img.naturalWidth / 800;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    let dy = Math.max(0, 600 - img.naturalHeight / scale);

    ctx.drawImage(
      img,
      crop.x * scale,
      (crop.y - dy) * scale,
      crop.width * scale,
      crop.height * scale,
      0,
      0,
      crop.width,
      crop.height,
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          let file = new File([blob], target.name);
          resolve(file);
        },
        "image/jpeg",
        1,
      );
    });
  }
  function getFilePath(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result);
      };
    });
  }

  async function handleCropComplete() {
    let cropped_file = await getCroppedImg(crop);
    let path = await getFilePath(cropped_file);
    setImage({ file: cropped_file, path });
    handleClose();
  }

  function handleClose() {
    onClose();
    setCrop({ aspect: ratio });
  }

  return (
    <Dialog maxWidth="md" fullWidth open={!!target} onClose={handleClose} onBackdropClick={handleClose}>
      <Box display="flex" justifyContent="flex-end" alignItems="center">
        <IconButton onClick={handleClose}>
          <Close fontSize="large" />
        </IconButton>
      </Box>

      <Box p={2} display="flex" flexDirection="column" alignItems="center" id="jjj">
        <ReactCrop
          className={classes.target_image}
          src={target?.src}
          crop={crop}
          onChange={setCrop}
          minWidth={minWidth}
        />

        <Button
          mt={2}
          color="primary"
          onClick={handleCropComplete}
          disabled={crop.width < minWidth || crop.height < minWidth / ratio}
        >
          이미지 생성
        </Button>
      </Box>
    </Dialog>
  );
};