import { Module } from '@nestjs/common';
import { CameraService } from './camera.service';
import { SocketModule } from 'src/socket/socket.module';
import { SettingsModule } from 'src/settings/settings.module';

@Module({
  imports: [SocketModule, SettingsModule],
  providers: [CameraService]
})
export class CameraModule {}
