import { Module } from '@nestjs/common';
import { CameraService } from './camera.service';
import { SocketModule } from 'src/socket/socket.module';
import { StatusModule } from 'src/status/status.module';

@Module({
  imports: [SocketModule, StatusModule],
  providers: [CameraService]
})
export class CameraModule {}
