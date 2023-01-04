import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WordreferenceService } from './wordreference/wordreference.service';
import { WordreferenceController } from './wordreference/wordreference.controller';
import { WordreferenceModule } from './wordreference/wordreference.module';

@Module({
  imports: [WordreferenceModule, HttpModule],
  controllers: [AppController, WordreferenceController],
  providers: [AppService, WordreferenceService],
})
export class AppModule {}
