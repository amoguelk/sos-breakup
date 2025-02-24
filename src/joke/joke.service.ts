import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import OpenAI from 'openai';
import { Joke } from './joke.entity';
import { JokeDto } from './joke.dto';

@Injectable()
export class JokeService {
  private readonly openai: OpenAI;
  constructor(
    @InjectRepository(Joke)
    private jokeRepository: Repository<Joke>,
  ) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  /**
   * Returns all joke objects
   */
  findAll() {
    return this.jokeRepository.find();
  }

  /**
   * Returns the joke object with the given ID
   * @param id The ID of the joke to find
   */
  findOne(id: number) {
    return this.jokeRepository.findOneBy({ id });
  }

  /**
   * Creates a new joke object
   * @param prompt The prompt given by the client
   * @param client_id The ID of the client that requested the joke
   */
  async create(prompt: string, client_id: string) {
    const chatResponse = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages: [
        {
          role: 'system',
          content: `Your purpose is to create a joke to cheer up the user, who is going through a break up. Adapt the contents to the joke based on the context given by the user's input. The joke must be short.`,
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1000,
    });
    const [message] = chatResponse.choices.map(
      (choice) => choice.message.content,
    );

    if (message === null || !chatResponse.usage?.total_tokens) {
      throw new Error('Error generating response');
    }

    const newJoke: JokeDto = {
      message,
      prompt,
      tokens: chatResponse.usage?.total_tokens,
      client_id,
    };

    await this.jokeRepository.save(newJoke);
    return newJoke;
  }
}
