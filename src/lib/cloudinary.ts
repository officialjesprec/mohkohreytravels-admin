import imageCompression from 'browser-image-compression';

export const cloudinaryConfig = {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    uploadPreset: 'mohkohrey_admin' // We'll need to create this in Cloudinary
};

export const uploadToCloudinary = async (file: File, folder: string = 'general') => {
    // 1. Optimize inside the code first (Compression)
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
    };

    try {
        const compressedFile = await imageCompression(file, options);

        // 2. Prepare Upload
        const formData = new FormData();
        formData.append('file', compressedFile);
        formData.append('upload_preset', cloudinaryConfig.uploadPreset);
        formData.append('folder', `mohkohrey-travels/${folder}`);

        // 3. Post to Cloudinary
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) throw new Error('Failed to upload to Cloudinary');

        const data = await response.json();
        return {
            url: data.secure_url,
            publicId: data.public_id,
        };
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        throw error;
    }
};

export const getCloudinaryUrl = (publicId: string) => {
    return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/f_auto,q_auto/${publicId}`;
};

