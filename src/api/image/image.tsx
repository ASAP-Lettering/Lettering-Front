import { authClient } from "../client";

export const postImage = async (imageFile: File) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  return await authClient.post("/api/v1/images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
