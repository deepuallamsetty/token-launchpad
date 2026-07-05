import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './token.entity';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  async saveToken(data: {
    tokenAddress: string;
    owner: string;
    name: string;
    symbol: string;
    initialSupply: string;
  }): Promise<Token> {
    const token = this.tokenRepository.create(data);
    return this.tokenRepository.save(token);
  }

  async getAllTokens(): Promise<Token[]> {
    return this.tokenRepository.find();
  }

  async getTokensByOwner(owner: string): Promise<Token[]> {
    return this.tokenRepository.find({
      where: { owner: owner.toLowerCase() },
    });
  }

  async getTotalTokens(): Promise<number> {
    return this.tokenRepository.count();
  }
}