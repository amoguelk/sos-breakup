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
import { MovieListService } from './movielist.service';

@WebSocketGateway()
export class MovieListGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private movieListService: MovieListService) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('MovieListGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client ${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('findAllMovieList')
  async handleFindAll(@ConnectedSocket() client: Socket) {
    try {
      const resp = await this.movieListService.findAll();
      client.emit('movieListSocket', resp);
    } catch (error) {
      this.logger.error(`Error getting all movie lists: ${error}`);
    }
  }

  @SubscribeMessage('findOneMovieList')
  async handleFindOne(
    @ConnectedSocket() client: Socket,
    @MessageBody('id') id: number,
  ) {
    try {
      if (!id) throw new Error('id field is required');
      const resp = await this.movieListService.findOne(id);
      client.emit('movieListSocket', resp);
    } catch (error) {
      this.logger.error(`Error getting movie list: ${error}`);
    }
  }

  @SubscribeMessage('createMovieList')
  async handleCreate(
    @ConnectedSocket() client: Socket,
    @MessageBody('prompt') prompt: string,
  ) {
    try {
      const resp = await this.movieListService.create(prompt, client.id);
      client.emit('movieListSocket', resp.message);
    } catch (error) {
      this.logger.error(`Error creating movie list: ${error}`);
    }
  }
}
