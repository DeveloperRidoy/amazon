export const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e.target.error);
  });
};


export const readFiles = (filesObj, limit) => {
  return new Promise( async (resolve, reject) => {
    try {
      const data = [];
      const files = Object.values(filesObj);
      if (limit >= files.length) { limit = files.length };
      for (let i = 0; i <= limit - 1; i++) { data.push(await readFile(files[i])) };
      resolve(data);
    } catch (error) {
      reject(error)
    }
  })
}