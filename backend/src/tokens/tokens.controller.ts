import { Controller, Get, Param } from '@nestjs/common';
import { TokensService } from './tokens.service';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Get()
  getAllTokens() {
    return this.tokensService.getAllTokens();
  }

  @Get('total')
  getTotalTokens() {
    return this.tokensService.getTotalTokens();
  }

  @Get(':owner')
  getTokensByOwner(@Param('owner') owner: string) {
    return this.tokensService.getTokensByOwner(owner);
  }
}