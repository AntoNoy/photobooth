import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CameraModule } from './camera/camera.module';
import { StatusModule } from './status/settings.module';

@Module({
  imports: [CameraModule, StatusModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
