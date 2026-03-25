export const cloudinaryConfig = {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
};

export const getCloudinaryUrl = (publicId: string) => {
    return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${publicId}`;
};
