// import dotenv from "dotenv";
// dotenv.config();

const url = `https://api.cloudinary.com/v1_1/dra0oytfr/auto/upload`;
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "teshager");

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  //   if (!response.ok) {
  //     throw new Error("Failed to upload file");
  //   }

  const responseData = await response.json();
  return responseData;
};

export default uploadFile;
