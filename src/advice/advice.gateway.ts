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
    this.logger.log(`Client ${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('findAllAdvice')
  async handleFindAll(@ConnectedSocket() client: Socket) {
    try {
      const resp = await this.adviceService.findAll();
      client.emit('adviceSocket', resp);
    } catch (error) {
      this.logger.error(`Error getting all advice objects: ${error}`);
    }
  }

  @SubscribeMessage('findOneAdvice')
  async handleFindOne(
    @ConnectedSocket() client: Socket,
    @MessageBody('id') id: number,
  ) {
    try {
      if (!id) throw new Error('id field is required');
      const resp = await this.adviceService.findOne(id);
      client.emit('adviceSocket', resp);
    } catch (error) {
      this.logger.error(`Error getting advice object: ${error}`);
    }
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
