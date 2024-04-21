import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CameraModule } from './camera/camera.module';
import { StatusModule } from './status/settings.module';
import { CanvasModule } from './canvas/canvas.module';

@Module({
  imports: [
    CameraModule,
    StatusModule,
    CanvasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
