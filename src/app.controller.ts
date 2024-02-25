import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { ModeEnum, StatusService } from './status/status.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly statusService: StatusService,
    ) { }

  @Get()
  getPage(@Res() res: Response) {
    res.sendFile(__dirname + '/assets/index.html');
  }

  @Get('cmd/:cmd')
  getControl(@Param('cmd') cmd: ModeEnum) {
    this.statusService.mode.next(cmd);
  }
}
