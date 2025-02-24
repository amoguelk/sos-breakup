import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieListGateway } from './movielist.gateway';
import { MovieListService } from './movielist.service';
import { MovieList } from './movielist.entity';

@Module({
  providers: [MovieListGateway, MovieListService],
  imports: [TypeOrmModule.forFeature([MovieList])],
})
export class MovieListModule {}
