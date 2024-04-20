import { Injectable } from '@nestjs/common';
import { GPhoto2 } from 'gphoto2';
import { SocketService } from 'src/socket/socket.service';
import { PagesEnum, SettingsService } from 'src/status/settings.service';
import { writeFile, readFile } from 'fs/promises';
import { BehaviorSubject } from 'rxjs';

export enum CameraStatusEnum {
    DISCONNECTED = 'disconnected', 
    CONNECTED = 'connected',
    PREVIEW = 'preview',
    PICTURE = 'picture',
}

@Injectable()
export class CameraService {

    private status = new BehaviorSubject<CameraStatusEnum>(CameraStatusEnum.DISCONNECTED);
    private camera: any;

    constructor(
        private socketService: SocketService,
        private settingsService: SettingsService,
    ) {
        this.settingsService.page.subscribe(async (status) => {
            this.command(status);
        })

        this.initCamera()
    }

    async initCamera(): Promise<void> {
        if (this.camera) {
            console.log('camera already open', this.camera)
            return;
        }
        const gphoto = new GPhoto2();
        gphoto.setLogLevel(1);
        gphoto.on("log", function (level, domain, message) {
            console.log(domain, message);
        });

        return new Promise<void>((res, rej) => {
            gphoto.list((list) => {
                if (list.length === 0) {
                    res()
                    console.log("no camera detected")
                    return
                };
                
                console.log(list[0]);
                this.camera = list[0];
                this.status.next(CameraStatusEnum.CONNECTED);
                res()
            })
        })
    }

    async command(status: PagesEnum) {
        console.log('status wanted', status)
        if (!this.camera) {
            console.log('no camera')
            if (this.status.value !== CameraStatusEnum.DISCONNECTED) {
                this.status.next(CameraStatusEnum.DISCONNECTED);
                this.initCamera()
                return
            }
        }

        switch (status) {
            case PagesEnum.PREVIEW:
                if(this.status.value === CameraStatusEnum.PREVIEW) return;
                this.status.next(CameraStatusEnum.PREVIEW);
                await this.getPreview();
                break;
            case PagesEnum.PICTURE:
                this.status.next(CameraStatusEnum.PICTURE);
                const picture = await this.takePicure();
                this.settingsService.addPicture(picture);
                break;
            default:
                break;
        }
        console.log('status :', status)
        this.status.next(CameraStatusEnum.CONNECTED);
    }

    async getPreview() {
        while (this.status.value === CameraStatusEnum.PREVIEW) {
            await this.takePreview();
            await waiting();
        }
    };

    private takePicure(): Promise<string> {
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
                            rej(er);
                            return;
                        }
                        const filePath = this.settingsService.pictureFolder + new Date().toISOString() + ".jpg";
                        await writeFile(filePath, data)

                        this.socketService.socket.emit("image", { data: Buffer.from(data).toString("base64") });
                        res(filePath);
                    }
                );
            });
        } catch (e) {
            console.log("error", e);
            this.command(PagesEnum.WAITING)
        }
    }

    private takePreview() {
        try {
            return new Promise((res, rej) => {
                this.camera.takePicture(
                    {
                        preview: true,
                        targetPath: this.settingsService.previewFolder + 'preview.XXXXXX'
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