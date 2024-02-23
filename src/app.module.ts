import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { GameReviewModule } from './game-review/game-review.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    databaseConfig,
    UserModule,
    AuthModule,
    GameModule,
    GameReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
