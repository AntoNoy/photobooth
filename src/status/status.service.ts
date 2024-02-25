import { Injectable } from '@nestjs/common';
import { mkdir, readdir, unlink } from 'fs/promises';
import { BehaviorSubject } from 'rxjs';

export enum ModeEnum {
    DISCONNECTED = 'disconnected',
    STANDBY = 'standby',
    WAITING = 'waiting',
    PREVIEW = 'preview',
    PICTURE = 'picture',
}

@Injectable()
export class StatusService {

    private userRef = 0;
    private pictureRootFolder = `${process.cwd()}/pictures/`

    previewFolder = `${process.cwd()}/preview/`
    get pictureFolder () {return `${this.pictureRootFolder}${this.userRef}/`}

    public mode = new BehaviorSubject<ModeEnum>(ModeEnum.DISCONNECTED);

    constructor() {
        readdir(`${process.cwd()}/pictures/`).then((files) => {
            this.userRef = files.length
        })
        this.mode.subscribe((mode) => {
            console.log('mode', mode)
     
           
            if(mode === ModeEnum.STANDBY){
                this.deleteAllPreviewFiles()
                this.userRef++
                mkdir(this.pictureFolder)
            }
        })
    }

    async deleteAllPreviewFiles() {
        try {
            const files = await readdir(this.previewFolder);

            await Promise.all(files.map(file =>
                unlink(this.previewFolder + file),
            ));

        } catch (err) {
            console.log(err);
        }
    }


}
