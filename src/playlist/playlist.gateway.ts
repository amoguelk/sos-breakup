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
import { PlaylistService } from './playlist.service';

@WebSocketGateway()
export class PlaylistGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private playlistService: PlaylistService) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('PlaylistGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client ${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('findAllPlaylist')
  async handleFindAll(@ConnectedSocket() client: Socket) {
    const resp = await this.playlistService.findAll();
    client.emit('playlistSocket', resp);
    return resp;
  }

  @SubscribeMessage('findOnePlaylist')
  async handleFindOne(
    @ConnectedSocket() client: Socket,
    @MessageBody('id') id: number,
  ) {
    const resp = await this.playlistService.findOne(id);
    client.emit('playlistSocket', resp);
    return resp;
  }

  @SubscribeMessage('createPlaylist')
  async handleCreate(
    @ConnectedSocket() client: Socket,
    @MessageBody('prompt') prompt: string,
  ) {
    try {
      const resp = await this.playlistService.create(prompt, client.id);
      client.emit('playlistSocket', resp.message);
    } catch (error) {
      this.logger.error(`Error creating playlist: ${error}`);
    }
  }
}
