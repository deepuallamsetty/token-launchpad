import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensService } from './tokens.service';
import { TokensController } from './tokens.controller';
import { TokenIndexerService } from './token-indexer.service';
import { Token } from './token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Token])],
  providers: [TokensService, TokenIndexerService],
  controllers: [TokensController],
})
export class TokensModule {}