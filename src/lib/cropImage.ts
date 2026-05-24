export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.src = url
  })

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0
): Promise<string | null> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  // set canvas size to match the bounding box
  canvas.width = image.width
  canvas.height = image.height

  ctx.translate(image.width / 2, image.height / 2)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.translate(-image.width / 2, -image.height / 2)

  ctx.drawImage(image, 0, 0)

  const croppedCanvas = document.createElement('canvas')
  const croppedCtx = croppedCanvas.getContext('2d')

  if (!croppedCtx) {
    return null
  }

  const MAX_SIZE = 400;
  let finalWidth = pixelCrop.width;
  let finalHeight = pixelCrop.height;

  if (finalWidth > MAX_SIZE || finalHeight > MAX_SIZE) {
    const ratio = Math.min(MAX_SIZE / finalWidth, MAX_SIZE / finalHeight);
    finalWidth = Math.round(finalWidth * ratio);
    finalHeight = Math.round(finalHeight * ratio);
  }

  croppedCanvas.width = finalWidth;
  croppedCanvas.height = finalHeight;

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    finalWidth,
    finalHeight
  );

  return new Promise((resolve, reject) => {
    const dataUrl = croppedCanvas.toDataURL('image/jpeg', 0.8);
    if (dataUrl && dataUrl !== 'data:,') {
      resolve(dataUrl);
    } else {
      reject(new Error('Canvas is empty'));
    }
  });
}
