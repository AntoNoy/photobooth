import { Injectable } from "@nestjs/common";
import { createCanvas, loadImage } from 'canvas';
import { writeFile } from "fs/promises";

@Injectable()
export class CanvasService {
    constructor() {
        console.log('CanvasService constructor');
        this.template3Pictures()
    }


    async initCanvas(): Promise<void> {
        const canvas = createCanvas(3000, 2000)
        const ctx = canvas.getContext('2d')

        const margin = 20

        //Background Color
        const gradient = ctx.createLinearGradient(0, 0, canvas.width,canvas.height);
        // Add three color stops
        gradient.addColorStop(0, "#d37115");
        gradient.addColorStop(1, "#fff");
        ctx.fillStyle = gradient;
        ctx.fillRect(0,0, canvas.width,canvas.height);

        //Load Images
        const image = await loadImage(`${process.cwd()}/pictures/1695825196046.jpeg`)
        const image2 = await loadImage(`${process.cwd()}/pictures/1695825196046.jpeg`)
        const image3 = await loadImage(`${process.cwd()}/pictures/1695825196046.jpeg`)
        const logo = await loadImage(`${process.cwd()}/pictures/logoMariage.png`)
     
        //Display Images
        ctx.drawImage(image, margin / 2, margin / 2, canvas.width / 2 - margin, canvas.height / 2 - margin)
        ctx.drawImage(image2, canvas.width / 2 + margin / 2, margin / 2, canvas.width / 2 - margin, canvas.height / 2 - margin)
        ctx.drawImage(image3, margin / 2, canvas.height / 2 + margin / 2, canvas.width / 2 - margin, canvas.height / 2 - margin)
        ctx.drawImage(logo, 1900, 1100, logo.width / 3, logo.height / 3)

        await writeFile(`${process.cwd()}/pictures/test.jpg`, canvas.toBuffer())
    }

    async template3Pictures(
        pictures1=`${process.cwd()}/pictures/1695825196046.jpeg`,
        pictures2=`${process.cwd()}/pictures/1695825196046.jpeg`,
        pictures3=`${process.cwd()}/pictures/1695825196046.jpeg`
    ): Promise<void> {
        const canvas = createCanvas(3000, 2000)
        const ctx = canvas.getContext('2d')

        const margin = 20

        //Background Color
        const gradient = ctx.createLinearGradient(0, 0, canvas.width,canvas.height);
        // Add three color stops
        gradient.addColorStop(0, "#d37115");
        gradient.addColorStop(1, "#fff");
        ctx.fillStyle = gradient;
        ctx.fillRect(0,0, canvas.width,canvas.height);

        //Load Images
        const image = await loadImage(pictures1)
        const image2 = await loadImage(pictures2)
        const image3 = await loadImage(pictures3)
        const logo = await loadImage(`${process.cwd()}/pictures/logoMariage.png`)
     
        //Display Images
        ctx.drawImage(image, margin / 2, margin / 2, canvas.width / 2 - margin, canvas.height / 2 - margin)
        ctx.drawImage(image2, canvas.width / 2 + margin / 2, margin / 2, canvas.width / 2 - margin, canvas.height / 2 - margin)
        ctx.drawImage(image3, margin / 2, canvas.height / 2 + margin / 2, canvas.width / 2 - margin, canvas.height / 2 - margin)
        ctx.drawImage(logo, 1900, 1100, logo.width / 3, logo.height / 3)

        await writeFile(`${process.cwd()}/pictures/test.jpg`, canvas.toBuffer())
    }
    
}