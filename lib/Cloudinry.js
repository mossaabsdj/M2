export default async function uploadFileToCloudinary(file, onProgress) {
  return new Promise((resolve, reject) => {
    const url = "https://api.cloudinary.com/v1_1/dgozr0fbn/auto/upload";
    const preset = "mohamed";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded * 100) / e.total);
        onProgress?.(progress);
      }
    });

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve({
            url: response.secure_url,
            type: response.resource_type,
            format: response.format,
            public_id: response.public_id,
          });
        } else {
          reject(new Error("File upload failed"));
        }
      }
    };

    xhr.open("POST", url);
    xhr.send(formData);
  });
}
