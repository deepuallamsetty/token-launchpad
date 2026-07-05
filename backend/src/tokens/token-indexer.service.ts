import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { TokensService } from './tokens.service';

const TOKEN_FACTORY_ADDRESS = '0xcb1452d0a8584eb661067853ED1A42926862779d';
const TOKEN_FACTORY_ABI = [
  'event TokenCreated(address indexed tokenAddress, address indexed owner, string name, string symbol, uint256 initialSupply)'
];

@Injectable()
export class TokenIndexerService implements OnModuleInit {
  private readonly logger = new Logger(TokenIndexerService.name);
  private provider: ethers.WebSocketProvider;
  private contract: ethers.Contract;

  constructor(private readonly tokensService: TokensService) {}

  async onModuleInit() {
    await this.startListening();
  }

  async startListening() {
    // connect to Sepolia via Alchemy WebSocket
    this.provider = new ethers.WebSocketProvider(
      'wss://eth-sepolia.g.alchemy.com/v2/hmUyvEBP6lEY1QhqhJ9QW'
    );

    this.contract = new ethers.Contract(
      TOKEN_FACTORY_ADDRESS,
      TOKEN_FACTORY_ABI,
      this.provider
    );

    this.logger.log('🔍 Listening for TokenCreated events...');

    // listen for new TokenCreated events
    this.contract.on('TokenCreated', async (tokenAddress, owner, name, symbol, initialSupply) => {
      this.logger.log(`🎉 New token created: ${name} (${symbol}) at ${tokenAddress}`);

      await this.tokensService.saveToken({
        tokenAddress: tokenAddress.toLowerCase(),
        owner: owner.toLowerCase(),
        name,
        symbol,
        initialSupply: initialSupply.toString(),
      });
    });

    // also index past events from block 0
    await this.indexPastEvents();
  }

async indexPastEvents() {
    this.logger.log(' Indexing past TokenCreated events...');

    const deploymentBlock = 11193598;
    const currentBlock = await this.provider.getBlockNumber();
    const chunkSize = 9;

    const filter = this.contract.filters.TokenCreated();

    for (let fromBlock = deploymentBlock; fromBlock <= currentBlock; fromBlock += chunkSize) {
      const toBlock = Math.min(fromBlock + chunkSize - 1, currentBlock);
      
      try {
        const events = await this.contract.queryFilter(filter, fromBlock, toBlock);

        for (const event of events) {
          const args = (event as ethers.EventLog).args;
          const tokenAddress = args[0].toLowerCase();
          const owner = args[1].toLowerCase();
          const name = args[2];
          const symbol = args[3];
          const initialSupply = args[4].toString();

          const existing = await this.tokensService.getAllTokens();
          const exists = existing.find(t => t.tokenAddress === tokenAddress);

          if (!exists) {
            await this.tokensService.saveToken({
              tokenAddress,
              owner,
              name,
              symbol,
              initialSupply,
            });
            this.logger.log(`s Indexed: ${name} (${symbol})`);
          }
        }
      } catch (error) {
        this.logger.error(`Error at block ${fromBlock}: ${error.message}`);
      }

      // wait 200ms between chunks to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    this.logger.log('Past events indexed!');
  }
}