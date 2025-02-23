import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistGateway } from './playlist.gateway';
import { PlaylistService } from './playlist.service';
import { Playlist } from './playlist.entity';

@Module({
  providers: [PlaylistGateway, PlaylistService],
  imports: [TypeOrmModule.forFeature([Playlist])],
})
export class PlaylistModule {}
