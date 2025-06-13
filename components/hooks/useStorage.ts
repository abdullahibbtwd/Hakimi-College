import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

// hooks/useStorage.ts
export const useStorage = () => {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveStorageId = useMutation(api.files.saveStorageId);

  const uploadFile = async (file: File) => {
    try {
      const postUrl = await generateUploadUrl();
      
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error(`File upload failed with status ${result.status}`);
      }

      const { storageId } = await result.json();
      
      // Save with metadata
      await saveStorageId({ 
        storageId,
        fileName: file.name,
        fileType: file.type
      });
      
      return storageId;
    } catch (error) {
      console.error("Upload failed:", error);
      throw new Error("File upload failed");
    }
  };

  return { uploadFile };
};