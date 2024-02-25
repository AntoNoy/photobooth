import { Injectable } from '@nestjs/common';
import { GPhoto2 } from 'gphoto2';
import { SocketService } from 'src/socket/socket.service';
import { promises as fs } from 'fs';
import { ModeEnum, StatusService } from 'src/status/status.service';

@Injectable()
export class CameraService {

    private gphoto: GPhoto2;
    mode: ModeEnum;


    constructor(
        private socketService: SocketService,
        private statusService: StatusService,
    ) {
        this.gphoto = new GPhoto2();
        this.gphoto.setLogLevel(1);
        this.gphoto.on("log", function (level, domain, message) {
            console.log(domain, message);
        });

        this.statusService.mode.subscribe(async (mode) => {
            this.config(mode);
        })
    }

    async config(mode: ModeEnum) {
        console.log('mode wanted', mode)
        // console.log(await this.getCamera())
        // if (!this.getCamera()) {
        //     mode !== ModeEnum.DISCONNECTED &&
        //         this.statusService.mode.next(ModeEnum.DISCONNECTED);
        //     return;
        // }
        this.mode = mode
        if (mode === ModeEnum.PREVIEW) {
            await this.getPreview();
        }
        console.log('mode final', mode)
    }

    useCamera(cb: (camera: any) => void) {
        return new Promise<void>((resolve) => {

            this.gphoto.list(async (list) => {
                if (list.length === 0) {
                    console.log("no camera detected")
                    resolve(undefined);
                    return
                };
                console.log(list[0]);
                await cb(list[0]);
                resolve();
            });
        })
    }

    async getPreview() {
        this.useCamera(async (camera) => {
            while (this.mode === ModeEnum.PREVIEW) {
                await this.takePreview(camera);
                await waiting();
            }
        })
    };

    private takePreview(camera) {
        try {
            return new Promise((res, rej) => {
                camera.takePicture(
                    {
                        preview: true,
                        targetPath: "/tmp/preview.jpg",
                    },
                    async (er, tmpname) => {
                        if (er) {
                            console.log("----er----", er);
                            rej(false);
                            return;
                        }
                        console.log("tmpname", tmpname);

                        const data = await fs.readFile(
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