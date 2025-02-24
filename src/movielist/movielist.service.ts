import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import OpenAI from 'openai';
import { MovieList } from './movielist.entity';
import { MovieListDto } from './movielist.dto';
import { generateAIResponse } from 'src/_utils/generateAIResponse';

@Injectable()
export class MovieListService {
  private readonly openai: OpenAI;
  constructor(
    @InjectRepository(MovieList)
    private movieListRepository: Repository<MovieList>,
  ) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  /**
   * Returns all movie list objects
   */
  findAll() {
    return this.movieListRepository.find();
  }

  /**
   * Returns the movie list object with the given ID
   * @param id The ID of the movie list to find
   */
  findOne(id: number) {
    return this.movieListRepository.findOneBy({ id });
  }

  /**
   * Creates a new movie list object
   * @param prompt The prompt given by the client
   * @param client_id The ID of the client that requested the movie list
   */
  async create(prompt: string, client_id: string) {
    const newMovieList: MovieListDto = {
      ...(await generateAIResponse({
        openaiClient: this.openai,
        systemContext:
          "Your purpose is to create a list of movies for the user that they can watch to get them through a breakup. Use the user's input to fine-tune the movies you choose. Always return only 5 movies per request. Do not include any greetings or additional text.",
        prompt,
      })),
      client_id,
    };

    await this.movieListRepository.save(newMovieList);
    return newMovieList;
  }
}
