import { Image } from "../include/image.js";
import {
  imageMapCoord,
  imageMapIf,
  mapWindow,
  makeBorder,
  dimCenter,
  isGrayish,
  makeGrayish,
} from "./imageProcessingHOF.js";

/*
const art = Image.loadImageFromGallery("art");
imageMapCoord(art, (img, x, y) => {
  const c = img.getPixel(x, y);
  if (y % 2 === 0) {
    return [c[0], 0, 0];
  }

  return c;
}).show();

*/

const whiteImg = Image.create(100, 100, [255, 255, 255]);
const bikeImg = Image.loadImageFromGallery("bike");

//test imageMapCoord()
imageMapCoord(whiteImg, (img, x, y) => {
  const c = img.getPixel(x,y);
  if (y % 2 === 0){
    return [c[0],0,0,];
  }
  return c;
}).show();


//test imageMapIf()
imageMapIf(bikeImg, (img, x, y) => img.getPixel(x,y)[0] > 100, (c) => [0, c[1], c[2]]).show();

//test mapWindow()
mapWindow(bikeImg, [100,50], [100, 50], () => [0,0,0]).show();

//test makeBorder()
makeBorder(bikeImg, 200, () => [0,0,0]).show();
makeBorder(whiteImg, 50, () => [0,0,0]).show();

//test dimCenter()
dimCenter(whiteImg, -5).show();
dimCenter(bikeImg, 100).show();

//test makeGrayish()
makeGrayish(whiteImg).show();
const food = Image.loadImageFromGallery("food");
makeGrayish(food).show();
