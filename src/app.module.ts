import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdviceModule } from './advice/advice.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Advice } from './advice/advice.entity';
import { PlaylistModule } from './playlist/playlist.module';
import { Playlist } from './playlist/playlist.entity';
import { MovieList } from './movielist/movielist.entity';
import { MovieListModule } from './movielist/movielist.module';
import { Joke } from './joke/joke.entity';
import { JokeModule } from './joke/joke.module';

/**
 * The root module of the application
 */
@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({ envFilePath: '.env.develop' }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: 'sos_breakup',
      port: 3306,
      synchronize: true, // ! Disable if prod
      entities: [Advice, Playlist, MovieList, Joke],
    }),
    // Modules
    AdviceModule,
    PlaylistModule,
    MovieListModule,
    JokeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
