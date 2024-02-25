import { Injectable } from '@nestjs/common';
import { BehaviorSubject } from 'rxjs';

export enum ModeEnum {
    DISCONNECTED='disconnected',
    WAITING='waiting',
    PREVIEW='preview',
    PICTURE='picture',
}

@Injectable()
export class StatusService {

    mode = new BehaviorSubject<ModeEnum>(ModeEnum.DISCONNECTED);


}
