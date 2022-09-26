/*eslint-disable @typescript-eslint/no-explicit-any*/
import { Component, Vue } from 'vue-property-decorator';
/*eslint-disable @typescript-eslint/no-explicit-any */

@Component
class ImageFileMixin extends Vue {
    private imageFileExtensions = /(\.jpg|\.jpeg|\.png|\.svg|\.svgz|\.webp|\.JPG|\.JPEG|\.PNG|\.SVG|\.SVGZ|\.WEBP)$/;

    public isImageFile(fileName: string): boolean {
        const valid = fileName.match(this.imageFileExtensions);
        return valid ? true : false;
    }

    public validateImageFile(selectedImage: any, maxSize: number): string {
        let errorMessage = '';
        if (!this.isImageFile(selectedImage.name)) {
            errorMessage = 'Please select an image file';
            return errorMessage;
        }
        if (selectedImage.size > maxSize) {
            errorMessage = 'Image file can not be more than 2MB';
            return errorMessage;
        }
        return (errorMessage = '');
    }

    public convertImageFileToFormData(imageFile: any): object {
        const formData = new FormData();
        formData.append('logo', imageFile);
        return formData;
    }

    public createObjectURLForImage(imageFile: any): string {
        return URL.createObjectURL(imageFile);
    }

    public revokeObjectURLForImage(imageURL: string): void {
        URL.revokeObjectURL(imageURL);
    }
}

export default ImageFileMixin;
