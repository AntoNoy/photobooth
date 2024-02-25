import { Injectable } from '@nestjs/common';
import { GPhoto2 } from 'gphoto2';
import { SocketService } from 'src/socket/socket.service';
import { ModeEnum, StatusService } from 'src/status/status.service';
import { writeFile, readFile } from 'fs/promises';

@Injectable()
export class CameraService {

    private gphoto: GPhoto2;
    private mode: ModeEnum;
    private camera: any; 

    constructor(
        private socketService: SocketService,
        private statusService: StatusService,
    ) {
        this.statusService.mode.subscribe(async (mode) => {
            this.config(mode);
        })

        this.openInstance()
    }

    checkInstance(){
        if (!this.camera) {
            this.openInstance()
        } else {
            console.log('camera already open', this.camera)
        }
    }

    openInstance(){
        this.gphoto = new GPhoto2();
        this.gphoto.setLogLevel(1);
        this.gphoto.on("log", function (level, domain, message) {
            console.log(domain, message);
        });
        this.gphoto.list(async (list) => {
            if (list.length === 0) {
                console.log("no camera detected")
                return
            };
            console.log(list[0]);
            this.camera = list[0];

            this.statusService.mode.next(ModeEnum.STANDBY);
        })
    }

    async config(mode: ModeEnum) {
        console.log('mode wanted', mode)
        if(mode === this.mode) return;
        
        if (!this.camera) {
            mode !== ModeEnum.DISCONNECTED &&
            this.statusService.mode.next(ModeEnum.DISCONNECTED);
            return;
        }

        this.mode = mode

        switch (mode) {
            case ModeEnum.PREVIEW:
                console.log('mode preview', mode)
                await this.getPreview();
                this.statusService.mode.next(ModeEnum.WAITING);
                break;
            case ModeEnum.PICTURE:
                console.log('mode capture', mode)
                await this.takePicure();
                this.statusService.mode.next(ModeEnum.WAITING);
                break;
            case ModeEnum.DISCONNECTED:
                console.log('mode disconnected', mode)
                break;
        }
    }

    async getPreview() {
            while (this.mode === ModeEnum.PREVIEW) {
                await this.takePreview();
                await waiting();
            }
    };

    private takePicure() {
        try {
            return new Promise((res, rej) => {
                console.log('takePicure')
                this.camera.takePicture(
                    {
                        download: true 
                    },
                    async (er, data) => { 
                        if (er) {
                            console.log("----er----", er);
                            rej(false);
                            return;
                        }
                        console.log("data", data);

                        await writeFile(this.statusService.pictureFolder + new Date().toISOString() + ".jpg", data)
                        this.socketService.socket.emit("image", { data: Buffer.from(data).toString("base64") });

                        res(true);
                    }
                );
            });
        } catch (e) {
            console.log("error", e);
        }
    }

    private takePreview() {
        try {
            return new Promise((res, rej) => {
                this.camera.takePicture(
                    {
                        preview: true,
                        targetPath: this.statusService.previewFolder +'preview.XXXXXX'
                    },
                    async (er, tmpname) => {
                        if (er) {
                            console.log("----er----", er);
                            rej(false);
                            return;
                        }
                        console.log("tmpname", tmpname);

                        const data = await readFile(
                            tmpname,
                            {
                                encoding: "base64",
                            }
                        )
                        this.socketService.socket.emit("image", { data });
                        res(true);
                    }
                );
            });
        } catch (e) {
            console.log("error", e);
        }
    }
}


function waiting(ms = 10) {
    return new Promise((res) => {
        setTimeout(() => {
            res(true);
        }, ms);
    });
}