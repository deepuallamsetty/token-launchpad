import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensModule } from './tokens/tokens.module';
import { Token } from './tokens/token.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'deepu',
      password: 'password123',
      database: 'token_launchpad',
      entities: [Token],
      synchronize: true, 
    }),
    TokensModule,
  ],
})
export class AppModule {}