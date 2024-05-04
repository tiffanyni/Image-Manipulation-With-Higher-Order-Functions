import type { Image, Color } from "../include/image.js";

export function imageMapCoord(img: Image, func: (img: Image, x: number, y: number) => Color): Image {
  const copy = img.copy();
  const coordinates = copy.coordinates();
  let i;
  for (i = 0; i < coordinates.length; ++i) {
    copy.setPixel(coordinates[i][0], coordinates[i][1], func(img, coordinates[i][0], coordinates[i][1]));
  }
  return copy;
}

export function imageMapIf(
  img: Image,
  cond: (img: Image, x: number, y: number) => boolean,
  func: (p: Color) => Color
): Image {
  return imageMapCoord(img, (img, x, y) => {
    if (cond(img, x, y)) {
      return func(img.getPixel(x, y));
    }
    return img.getPixel(x, y);
  });
}

export function mapWindow(
  img: Image,
  xInterval: number[], // Assumed to be a two element array containing [x_min, x_max]
  yInterval: number[], // Assumed to be a two element array containing [y_min, y_max]
  func: (p: Color) => Color
): Image {
  //condition is that the x, y coords are in range
  return imageMapIf(
    img,
    (img, x, y) => {
      return x >= xInterval[0] && x <= xInterval[1] && y >= yInterval[0] && y <= yInterval[1];
    },
    func
  );
}

export function makeBorder(img: Image, thickness: number, func: (p: Color) => Color): Image {
  return imageMapIf(
    img,
    (img, x, y) => {
      //calculate distance to top edge, then left, then right, then bottom
      return (
        x < thickness ||
        y < thickness ||
        Math.abs(img.width - 1 - x) < thickness ||
        Math.abs(img.height - 1 - y) < thickness
      );
    },
    func
  );
}

export function dimCenter(img: Image, thickness: number): Image {
  return imageMapIf(
    img,
    (img, x, y) => {
      return !(
        x < thickness ||
        y < thickness ||
        Math.abs(img.width - 1 - x) < thickness ||
        Math.abs(img.height - 1 - y) < thickness
      );
    },
    c => [Math.floor(c[0] * 0.8), Math.floor(c[1] * 0.8), Math.floor(c[2] * 0.8)]
  );
}

//return true if the difference between the maximum and minimum color channel value is at most 85
export function isGrayish(p: Color): boolean {
  const max = Math.max(p[0], p[1], p[2]);
  const min = Math.min(p[0], p[1], p[2]);
  return max - min <= 85;
}

export function makeGrayish(img: Image): Image {
  return imageMapIf(
    img,
    (img, x, y) => {
      return !isGrayish(img.getPixel(x, y));
    },
    c => [
      Math.floor((c[0] + c[1] + c[2]) / 3),
      Math.floor((c[0] + c[1] + c[2]) / 3),
      Math.floor((c[0] + c[1] + c[2]) / 3),
    ]
  );
}
