import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway()
export class SocketService implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() socket;

    async handleConnection() {
        console.log('connected');
        this.socket.emit('image', { data: 'testt' });
    }

    async handleDisconnect() {
        console.log('disconnected');
        this.socket.emit('image', { data: 'testt2' });
    }

    @SubscribeMessage('chat')
    async onChat(client, message) {
        client.broadcast.emit('chat', message);
    }
}