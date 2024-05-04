# Image-Manipulation-With-Higher-Order-Functions

Similar to Image Manipulation, here are some of the more complicated functions introduced programmed using higher-order functions. 

imageMapCoord:
Takes in an image and a function (that takes in the x, y coordinates and returns a color) and returns an image with the same dimensions as the supplied image.
For each pixel in the new image, its color should be the result of applying func to the image and the pixel's coordinates. This function is more general than imageMap; the new pixel's color may also depend on its coordinates, and any other elements of the image (perhaps other pixels).

imageMapIf​:
This function takes in an image, a function that returns a boolean, and a function that returns a color and returns a new image such that the color c at the original (x,y) coordinate is either:
1) The value func(c) when cond(img, x, y) returns true
2) c otherwise

mapWindow​:
This function takes in an image, a x interval range, a y interval range, and a function (returns a color) and returns an image that applies the function to the pixels inside those coordinate range. All other pixels are left unchanged. 

isGrayish​:
This function returns whether a pixel is "grayish". By grayish, we mean if the difference between the maximum and minimum color channel value is at most 85 (one third of 255).

makeGrayish​:
The result is a new image, where each grayish pixel, as determined by the isGrayish function, is left unchanged. All other pixels should be replaced with a gray-scale pixel, computed by averaging the three channels.

pixelBlur:
This function blurs a pixel. To define blurring, each color channel of the resulting pixel should be the truncated mean of the same channels of the (x,y) pixel itself and its neighbors (up, down, left, right) in img.

imageBlur​:
The result is a new image that is the blurred version of the input image, with pixels obtained by applying pixelBlur to each pixel of the input image.
