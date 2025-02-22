import { Injectable } from '@nestjs/common';
import { AdviceDto } from './dto/advice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Advice } from './advice.entity';
import { Repository } from 'typeorm';
import OpenAI from 'openai';

@Injectable()
export class AdviceService {
  private readonly openai: OpenAI;
  constructor(
    @InjectRepository(Advice)
    private adviceRepository: Repository<Advice>,
  ) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  /**
   * Returns all advice objects
   */
  findAll() {
    return this.adviceRepository.find();
  }

  /**
   * Returns the advice object with the given ID
   * @param id The ID of the advice to find
   */
  findOne(id: number) {
    return this.adviceRepository.findOneBy({ id });
  }

  /**
   * Creates a new advice object
   * @param advice An object with the advice information
   */
  async create(prompt: string, client_id: string) {
    const chatResponse = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages: [
        {
          role: 'system',
          content: `Your purpose is to create a piece of advice to the user based on the given prompt. The user recently went through a breakup, and is looking for friendly, helpful advice. Keep your responses very short and to the point, but make sure to make them relevant to the user's specific situation.`,
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

    const newAdvice: AdviceDto = {
      message,
      tokens: chatResponse.usage?.total_tokens,
      client_id,
    };

    await this.adviceRepository.save(newAdvice);
    return newAdvice;
  }
}
