import React, { useState, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { Box, Dialog, IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { Button } from "components/materialui";

export const ImageCropModal = ({ target, ratio, setImage, onClose }) => {
  const [crop, setCrop] = useState({ aspect: ratio });

  function getCroppedImg(crop) {
    const img = document.createElement("img");
    img.src = target.src;

    const canvas = document.createElement("canvas");
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      img,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
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

      <Box p={2} display="flex" flexDirection="column" alignItems="center">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="800px">
          <ReactCrop src={target?.src} crop={crop} onChange={setCrop} />
        </Box>

        <Button mt={2} color="primary" onClick={handleCropComplete}>
          이미지 생성
        </Button>
      </Box>
    </Dialog>
  );
};
