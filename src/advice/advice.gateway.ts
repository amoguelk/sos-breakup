/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AdviceService } from './advice.service';

@WebSocketGateway()
export class AdviceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private adviceService: AdviceService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.server.emit('room', `Client ${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    this.server.emit('room', `Client ${client.id} disconnected`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: any,
  ) {
    this.server.emit('room', `[${client.id}] -> ${message}`);
  }

  @SubscribeMessage('findAll')
  handleEvent() {
    const resp = this.adviceService.findAll();
    console.log('🪲 resp:', resp);
  }
}
