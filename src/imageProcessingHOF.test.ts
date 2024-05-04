import assert from "assert";
import { COLORS, Image } from "../include/image.js";
import {
  imageMapCoord,
  imageMapIf,
  mapWindow,
  makeBorder,
  dimCenter,
  isGrayish,
  makeGrayish,
} from "./imageProcessingHOF.js";

describe("imageMapCoord", () => {
  function identity(img: Image, x: number, y: number) {
    return img.getPixel(x, y);
  }

  it("should return a different image", () => {
    const input = Image.create(10, 10, COLORS.WHITE);
    const output = imageMapCoord(input, identity);
    assert(input !== output);
  });

  // More tests for imageMapCoord go here.
  it("should contain red stripes every other row, starting at row 2", () => {
    const input = Image.create(10, 10, COLORS.WHITE);
    const modifiedInput = imageMapCoord(input, (img, x, y) => {
      const c = img.getPixel(x, y);
      if (y % 2 === 0) {
        return [c[0], 0, 0];
      }
      return c;
    });
    const pixel = modifiedInput.getPixel(0, 2);
    assert(pixel[0] === 255);
    assert(pixel[1] === 0);
    assert(pixel[2] === 0);

    const pixel2 = modifiedInput.getPixel(5, 4);
    assert(pixel2[0] === 255);
    assert(pixel2[1] === 0);
    assert(pixel2[2] === 0);
  });
});

describe("imageMapIf", () => {
  // More tests for imageMapIf go here
  const whiteImg = Image.create(10, 10, COLORS.WHITE);
  //condition is if the red value is 255
  //func is that it will erase the red value to 0
  it("should change all red components from 255 to 0 and keep green and blue as 255", () => {
    const modifiedImg = imageMapIf(
      whiteImg,
      (img, x, y) => img.getPixel(x, y)[0] === 255,
      c => [0, c[1], c[2]]
    );
    const firstPixel = modifiedImg.getPixel(0, 0);
    assert(firstPixel[0] === 0);
    assert(firstPixel[1] === 255);
    assert(firstPixel[2] === 255);
  });

  const bikeImg = Image.loadImageFromGallery("bike");
  it("should decrement green amount by 50 if it exceeds 150", () => {
    const modifiedBikeImg = imageMapIf(
      bikeImg,
      (img, x, y) => img.getPixel(x, y)[1] > 150,
      c => [c[0], c[1] - 50, c[2]]
    );
    const pixel = bikeImg.getPixel(400, 400);
    const greenExceedsAmount = pixel[1] > 150;
    const modifiedPixel = modifiedBikeImg.getPixel(400, 400);
    if (greenExceedsAmount) {
      console.log("green exceeds expectation in test 4");
      assert(modifiedPixel[1] === pixel[1] - 50);
    } else {
      console.log("green does not change in test 4");
      assert(modifiedPixel[1] === pixel[1]);
    }
  });
});

describe("mapWindow", () => {
  // More tests for mapWindow go here
  const bikeImg = Image.loadImageFromGallery("bike");
  const modifiedBikeImg = mapWindow(bikeImg, [0, 100], [50, 200], () => [0, 0, 0]);

  it("should not change bc y coordinate is out of range", () => {
    const pixel = modifiedBikeImg.getPixel(0, 0);
    //should not change bc y coordinate is out of range
    assert(pixel[0] === bikeImg.getPixel(0, 0)[0]);
    assert(pixel[1] === bikeImg.getPixel(0, 0)[1]);
    assert(pixel[2] === bikeImg.getPixel(0, 0)[2]);
  });
  it("should make a black window bc pixel is in range", () => {
    const pixel2 = modifiedBikeImg.getPixel(100, 200);
    assert(pixel2[0] === 0);
    assert(pixel2[1] === 0);
    assert(pixel2[2] === 0);
  });

  it("should make a black window within range while given out of bound indices", () => {
    const modifiedBikeImg = mapWindow(bikeImg, [-50, 50], [200, 1000], () => [0, 0, 0]);
    const pixel = modifiedBikeImg.getPixel(0, 200);
    assert(pixel[0] === 0);
    assert(pixel[1] === 0);
    assert(pixel[2] === 0);

    const pixel2 = modifiedBikeImg.getPixel(50, 200);
    assert(pixel2[0] === 0);
    assert(pixel2[1] === 0);
    assert(pixel2[2] === 0);

    const pixel3 = modifiedBikeImg.getPixel(50, 199);
    assert(pixel3[0] === bikeImg.getPixel(50, 199)[0]);
    assert(pixel3[1] === bikeImg.getPixel(50, 199)[1]);
    assert(pixel3[2] === bikeImg.getPixel(50, 199)[2]);
  });
});

describe("makeBorder", () => {
  // More tests for makeBorder go here
  const whiteImg = Image.create(100, 100, COLORS.WHITE);
  it("should make a 10 by 10 black border", () => {
    const modifiedWhiteImg = makeBorder(whiteImg, 10, () => [0, 0, 0]);
    const pixel = modifiedWhiteImg.getPixel(10, 10);
    //should not  change: distance 10
    assert(pixel[0] === 255);
    assert(pixel[1] === 255);
    assert(pixel[2] === 255);

    const pixel2 = modifiedWhiteImg.getPixel(0, 9);
    //should change: distance 9
    assert(pixel2[0] === 0);
    assert(pixel2[1] === 0);
    assert(pixel2[2] === 0);

    const pixel3 = modifiedWhiteImg.getPixel(40, 20);
    //should not change: distance 20
    assert(pixel3[0] === 255);
    assert(pixel3[1] === 255);
    assert(pixel3[2] === 255);
  });

  it("should make a 1 by 1 black border", () => {
    const modifiedWhiteImg = makeBorder(whiteImg, 1, () => [0, 0, 0]);
    const pixel = modifiedWhiteImg.getPixel(2, 1);
    //should not change: distance is exactly 1
    assert(pixel[0] === 255);
    assert(pixel[1] === 255);
    assert(pixel[2] === 255);

    //should change: distance is 0
    const pixel2 = modifiedWhiteImg.getPixel(99, 99);
    assert(pixel2[0] === 0);
    assert(pixel2[1] === 0);
    assert(pixel2[2] === 0);
  });

  it("should not modify image because thickness is negative", () => {
    const modifiedWhiteImg = makeBorder(whiteImg, -5, () => [0, 0, 0]);
    const pixel = modifiedWhiteImg.getPixel(0, 0);
    assert(pixel[0] === 255);
    assert(pixel[1] === 255);
    assert(pixel[2] === 255);
  });

  it("should not modify image because thickness is 0", () => {
    const modifiedWhiteImg = makeBorder(whiteImg, 0, () => [0, 0, 0]);
    const pixel = modifiedWhiteImg.getPixel(0, 0);
    assert(pixel[0] === 255);
    assert(pixel[1] === 255);
    assert(pixel[2] === 255);
  });
});

describe("dimCenter", () => {
  // More tests for dimCenter go here
  const whiteImg = Image.create(100, 100, COLORS.WHITE);
  it("should dim the entire image", () => {
    const modifiedWhiteImg = dimCenter(whiteImg, 0);
    const pixel = modifiedWhiteImg.getPixel(0, 0);
    assert(pixel[0] === 204);
    assert(pixel[1] === 204);
    assert(pixel[2] === 204);

    const pixel2 = modifiedWhiteImg.getPixel(99, 99);
    assert(pixel2[0] === 204);
    assert(pixel2[1] === 204);
    assert(pixel2[2] === 204);

    const pixel3 = modifiedWhiteImg.getPixel(50, 50);
    assert(pixel3[0] === 204);
    assert(pixel3[1] === 204);
    assert(pixel3[2] === 204);
  });

  it("should dim everything execept for 5px border", () => {
    const modifiedWhiteImg = dimCenter(whiteImg, 5);

    const pixel = modifiedWhiteImg.getPixel(5, 4);
    assert(pixel[0] === 255);
    assert(pixel[1] === 255);
    assert(pixel[2] === 255);

    const pixel2 = modifiedWhiteImg.getPixel(40, 60);
    assert(pixel2[0] === 204);
    assert(pixel2[1] === 204);
    assert(pixel2[2] === 204);
  });

  it("should not alter the black image at all", () => {
    const blackImg = Image.create(100, 100, COLORS.BLACK);
    const modifiedBlackImg = dimCenter(blackImg, 20);

    const pixel = modifiedBlackImg.getPixel(0, 0);
    assert(pixel[0] === 0);
    assert(pixel[1] === 0);
    assert(pixel[2] === 0);

    const pixel2 = modifiedBlackImg.getPixel(5, 5);
    assert(pixel2[0] === 0);
    assert(pixel2[1] === 0);
    assert(pixel2[2] === 0);

    const pixel3 = modifiedBlackImg.getPixel(50, 50);
    assert(pixel3[0] === 0);
    assert(pixel3[1] === 0);
    assert(pixel3[2] === 0);
  });
});

describe("isGrayish", () => {
  // More tests for isGrayish go here
  const whiteImg = Image.create(10, 10, COLORS.WHITE);

  it("should return true for a white pixel", () => {
    //difference is 0; 0 <= 85
    const pixel = whiteImg.getPixel(0, 0);
    assert(isGrayish(pixel) === true);
  });

  it("should return false for AQUA[0,255,255]", () => {
    whiteImg.setPixel(1, 1, COLORS.AQUA);
    const aquaPixel = whiteImg.getPixel(1, 1);
    assert(isGrayish(aquaPixel) === false);
  });

  it("should return true for when difference is exactly 85", () => {
    whiteImg.setPixel(2, 2, [0, 30, 85]);
    const somePixel = whiteImg.getPixel(2, 2);
    assert(isGrayish(somePixel) === true);
  });
});

describe("makeGrayish", () => {
  // More tests for makeGrayish go here
  const whiteImg = Image.create(10, 10, COLORS.WHITE);
  const bikeImg = Image.loadImageFromGallery("bike");

  it("should not alter the white image at all", () => {
    const modifiedWhiteImg = makeGrayish(whiteImg);
    const pixel = modifiedWhiteImg.getPixel(5, 5);
    assert(pixel[0] === 255);
    assert(pixel[1] === 255);
    assert(pixel[2] === 255);
  });

  it("should turn grayify the bike image", () => {
    const modifiedBikeImg = makeGrayish(bikeImg);
    const pixel = bikeImg.getPixel(0, 0);
    const modifiedPixel = modifiedBikeImg.getPixel(0, 0);
    if (isGrayish(pixel)) {
      assert(modifiedPixel[0] === pixel[0]);
      assert(modifiedPixel[1] === pixel[1]);
      assert(modifiedPixel[2] === pixel[2]);
    } else {
      const avg = Math.floor((pixel[0] + pixel[1] + pixel[2]) / 3);
      assert(modifiedPixel[0] === avg);
      assert(modifiedPixel[1] === avg);
      assert(modifiedPixel[2] === avg);
    }
  });
});
