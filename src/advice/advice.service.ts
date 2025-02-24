import { Injectable } from '@nestjs/common';
import { AdviceDto } from './advice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Advice } from './advice.entity';
import { Repository } from 'typeorm';
import OpenAI from 'openai';
import { generateAIResponse } from 'src/_utils/generateAIResponse';

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
   * @param prompt The prompt given by the client
   * @param client_id The ID of the client that requested the advice
   */
  async create(prompt: string, client_id: string) {
    const newAdvice: AdviceDto = {
      ...(await generateAIResponse({
        openaiClient: this.openai,
        systemContext:
          "Your purpose is to create a piece of advice to the user based on the given prompt. The user recently went through a breakup, and is looking for friendly, helpful advice. Keep your responses very short and to the point, but make sure to make them relevant to the user's specific situation.",
        prompt,
      })),
      client_id,
    };

    await this.adviceRepository.save(newAdvice);
    return newAdvice;
  }
}
