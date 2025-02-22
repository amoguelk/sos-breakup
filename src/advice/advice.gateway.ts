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
import { Advice } from './interfaces/advice.interface';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class AdviceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private adviceService: AdviceService) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AdviceGateway');

  handleConnection(client: Socket) {
    this.logger.log('adviceSocket', `Client ${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log('adviceSocket', `Client ${client.id} disconnected`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: any,
  ) {
    this.server.emit('adviceSocket', `[${client.id}] -> ${message}`);
  }

  /**
   * Returns all advice objects
   */
  @SubscribeMessage('findAll')
  handleFindAll() {
    const resp = this.adviceService.findAll();
    this.logger.debug(`resp: ${resp}`);
  }

  /**
   * Creates a new advice object
   * @param advice An object with the advice information
   */
  @SubscribeMessage('create')
  handleCreate(
    @ConnectedSocket() client: Socket,
    @MessageBody() adviceStr: string,
  ) {
    const advice: Advice = JSON.parse(adviceStr) as Advice;
    advice.client_id = client.id;
    this.logger.debug(`advice: ${advice.message}, sent to ${advice.client_id}`);
  }
}
