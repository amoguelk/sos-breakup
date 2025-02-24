import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JokeGateway } from './joke.gateway';
import { JokeService } from './joke.service';
import { Joke } from './joke.entity';

@Module({
  providers: [JokeGateway, JokeService],
  imports: [TypeOrmModule.forFeature([Joke])],
})
export class JokeModule {}
