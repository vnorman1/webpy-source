import { ImageFile, ConversionSettings, ProcessingStatus } from '../types';

// Helper: load image as HTMLImageElement
function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new window.Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };
        img.onerror = reject;
        img.src = url;
    });
}

// Helper: draw image to canvas and export as webp Blob
async function imageToWebpBlob(img: HTMLImageElement, settings: ConversionSettings): Promise<Blob> {
    // Méretezés
    const maxWidth = parseInt(settings.maxWidth) || img.width;
    const maxHeight = parseInt(settings.maxHeight) || img.height;
    let targetWidth = img.width;
    let targetHeight = img.height;
    if (maxWidth && img.width > maxWidth) {
        targetHeight = Math.round((img.height * maxWidth) / img.width);
        targetWidth = maxWidth;
    }
    if (maxHeight && targetHeight > maxHeight) {
        targetWidth = Math.round((targetWidth * maxHeight) / targetHeight);
        targetHeight = maxHeight;
    }
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context error');
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    // Minőség 0-1 között
    const quality = Math.max(0, Math.min(1, settings.quality / 100));
    return await new Promise((resolve, reject) => {
        canvas.toBlob(
            blob => {
                if (blob) resolve(blob);
                else reject(new Error('WebP konverzió sikertelen')); 
            },
            'image/webp',
            quality
        );
    });
}

export const processImage = async (
    imageFile: ImageFile,
    settings: ConversionSettings
): Promise<Partial<ImageFile>> => {
    try {
        const img = await loadImage(imageFile.file);
        const webpBlob = await imageToWebpBlob(img, settings);
        const processedSize = webpBlob.size;
        const percentageSaved = Math.round(((imageFile.originalSize - processedSize) / imageFile.originalSize) * 100);
        return {
            status: ProcessingStatus.Done,
            processedSize,
            percentageSaved,
            processedBlob: webpBlob,
        };
    } catch (err) {
        return {
            status: ProcessingStatus.Error,
        };
    }
};
