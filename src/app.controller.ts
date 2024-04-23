import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { PagesEnum, SettingsService } from './settings/settings.service';

@Controller()
export class AppController {
  constructor(
    private readonly settingsService: SettingsService,
    ) { }

  @Get(':page')
  getPage(@Res() res: Response, @Param('page') page: string) {
    res.sendFile(`${__dirname}/assets/${page}.html`);
  }

  @Get('cmd/:cmd')
  getControl(@Param('cmd') cmd: PagesEnum) {
    this.settingsService.page.next(cmd);
  }
}
