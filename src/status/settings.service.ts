import { Injectable } from '@nestjs/common';
import { mkdir, readdir, unlink } from 'fs/promises';
import { BehaviorSubject } from 'rxjs';

export enum PagesEnum {
    DISCONNECTED = 'disconnected',
    ERROR = 'error',
    LOGOUT = 'logout',
    SELECT_TEMPLATE = 'select_template',
    PREVIEW = 'preview',
    PICTURE = 'picture',
    CONFIRMATION = 'confirmation',
    PRINT = 'print',
    WAITING = 'waiting',
}

export class Session {
    constructor(config: Partial<Session>) {
        Object.assign(this, config);
    }
    userRef: number;
    pictures: string[] = []
    pictureModel: "x1" | "x3" = "x1";
}

@Injectable()
export class SettingsService {

    private pictureRootFolder = `${process.cwd()}/pictures/`
    previewFolder = `${process.cwd()}/preview/`
    get pictureFolder() { return `${this.pictureRootFolder}${this._session?.userRef}/` }

    public page = new BehaviorSubject<PagesEnum>(PagesEnum.DISCONNECTED);

    private _session: Session;
    get session() { return this._session }

    constructor() {
        this.page.subscribe(async (status) => {
            console.log('status', status)

            if (status === PagesEnum.LOGOUT) {
                await this.initSessionDatas()
            } 
        })
        this.initSessionDatas() 
    }

    async initSessionDatas() {
        await this.deleteAllPreviewFiles()
        if (this._session?.userRef !== undefined) {
            this._session.userRef++
        }
        this._session = new Session({
            userRef: this._session?.userRef ? this._session.userRef + 1 : await _getUserRef(),
        })
        await mkdir(this.pictureFolder).catch(console.log)
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

    async addPicture(picture: string) {
        this._session.pictures.push(picture)
    }
}

async function _getUserRef() {
    return readdir(`${process.cwd()}/pictures/`).then((files) => files?.length ?? 0)
}