import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensModule } from './tokens/tokens.module';
import { Token } from './tokens/token.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
  url: process.env.DATABASE_URL,
  autoLoadEntities: true,
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,
  },
      entities: [Token],
    }),
    TokensModule,
  ],
})
export class AppModule {}
