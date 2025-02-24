import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import OpenAI from 'openai';
import { Playlist } from './playlist.entity';
import { PlaylistDto } from './playlist.dto';
import { generateAIResponse } from 'src/_utils/generateAIResponse';

@Injectable()
export class PlaylistService {
  private readonly openai: OpenAI;
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
  ) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  /**
   * Returns all playlist objects
   */
  findAll() {
    return this.playlistRepository.find();
  }

  /**
   * Returns the playlist object with the given ID
   * @param id The ID of the playlist to find
   */
  findOne(id: number) {
    return this.playlistRepository.findOneBy({ id });
  }

  /**
   * Creates a new playlist object
   * @param prompt The prompt given by the client
   * @param client_id The ID of the client that requested the playlist
   */
  async create(prompt: string, client_id: string) {
    const newPlaylist: PlaylistDto = {
      ...(await generateAIResponse({
        openaiClient: this.openai,
        systemContext:
          "Your purpose is to create a playlist for the user, who has recently gone through a breakup. Use the user's input to fine-tune the songs you choose. Always return only 5 songs per request. Do not include any greetings or additional text.",
        prompt,
      })),
      client_id,
    };

    await this.playlistRepository.save(newPlaylist);
    return newPlaylist;
  }
}
