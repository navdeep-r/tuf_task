export const extractDominantColor = (src: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve("#8B5E3C");

      ctx.drawImage(img, 0, 0, img.width, img.height);
      const data = ctx.getImageData(0, 0, img.width, img.height).data;
      let r = 0, g = 0, b = 0, count = 0;

      // sample every 10th pixel to be faster
      for (let i = 0; i < data.length; i += 40) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }

      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

      resolve(`rgb(${r}, ${g}, ${b})`);
    };
    img.onerror = () => resolve("#8B5E3C");
    img.src = src;
  });
};
