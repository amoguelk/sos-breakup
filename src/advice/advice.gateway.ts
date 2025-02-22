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
import { AdviceDto } from './dto/advice.dto';

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
  async handleFindAll() {
    const resp = await this.adviceService.findAll();
    this.server.emit('adviceSocket', resp);
    return resp;
  }

  @SubscribeMessage('findOneAdvice')
  async handleFindOne(@MessageBody('id') id: number) {
    const resp = await this.adviceService.findOne(id);
    this.server.emit('adviceSocket', resp);
    return resp;
  }

  @SubscribeMessage('createAdvice')
  async handleCreate(
    @ConnectedSocket() client: Socket,
    @MessageBody() createAdviceDto: AdviceDto,
  ) {
    createAdviceDto.client_id = client.id;
    await this.adviceService.create(createAdviceDto);
    this.logger.debug(
      `Client ${createAdviceDto.client_id} has created advice with message "${createAdviceDto.message}"`,
    );
  }
}
