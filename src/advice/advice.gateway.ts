import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { AdviceService } from './advice.service';

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

  @SubscribeMessage('findAllAdvice')
  async handleFindAll(@ConnectedSocket() client: Socket) {
    const resp = await this.adviceService.findAll();
    client.emit('adviceSocket', resp);
    return resp;
  }

  @SubscribeMessage('findOneAdvice')
  async handleFindOne(
    @ConnectedSocket() client: Socket,
    @MessageBody('id') id: number,
  ) {
    const resp = await this.adviceService.findOne(id);
    client.emit('adviceSocket', resp);
    return resp;
  }

  @SubscribeMessage('createAdvice')
  async handleCreate(
    @ConnectedSocket() client: Socket,
    @MessageBody('prompt') prompt: string,
  ) {
    try {
      const resp = await this.adviceService.create(prompt, client.id);
      client.emit('adviceSocket', resp.message);
    } catch (error) {
      this.logger.error(`Error creating advice: ${error}`);
    }
  }
}
