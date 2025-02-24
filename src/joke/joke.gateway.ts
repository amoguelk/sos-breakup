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
import { JokeService } from './joke.service';

@WebSocketGateway()
export class JokeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private jokeService: JokeService) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('JokeGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client ${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('findAllJoke')
  async handleFindAll(@ConnectedSocket() client: Socket) {
    try {
      const resp = await this.jokeService.findAll();
      client.emit('jokeSocket', resp);
    } catch (error) {
      this.logger.error(`Error getting all jokes: ${error}`);
    }
  }

  @SubscribeMessage('findOneJoke')
  async handleFindOne(
    @ConnectedSocket() client: Socket,
    @MessageBody('id') id: number,
  ) {
    try {
      const resp = await this.jokeService.findOne(id);
      client.emit('jokeSocket', resp);
    } catch (error) {
      this.logger.error(`Error getting joke: ${error}`);
    }
  }

  @SubscribeMessage('createJoke')
  async handleCreate(
    @ConnectedSocket() client: Socket,
    @MessageBody('prompt') prompt: string,
  ) {
    try {
      const resp = await this.jokeService.create(prompt, client.id);
      client.emit('jokeSocket', resp.message);
    } catch (error) {
      this.logger.error(`Error creating joke: ${error}`);
    }
  }
}
