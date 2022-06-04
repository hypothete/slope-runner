import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store";

export function useTextureImage() {
  const tileTexture = useSelector((state: RootState) => state.level.tileSrc);
  const [textureImage, setTextureImage] = useState<HTMLImageElement | null>(null);
  const img = new Image();
  img.src = tileTexture;
  img.decode().then(() => {
    setTextureImage(img);
  });
  return textureImage;
}