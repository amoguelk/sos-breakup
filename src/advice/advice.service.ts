import { Injectable } from '@nestjs/common';
import { AdviceDto } from './dto/advice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Advice } from './advice.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdviceService {
  constructor(
    @InjectRepository(Advice)
    private adviceRepository: Repository<Advice>,
  ) {}

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
  async create(createAdviceDto: AdviceDto) {
    await this.adviceRepository.save(createAdviceDto);
  }
}
