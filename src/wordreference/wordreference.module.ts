import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WordreferenceController } from './wordreference.controller';
import { WordreferenceService } from './wordreference.service';

@Module({
    imports: [HttpModule],
    controllers: [WordreferenceController],
    providers: [WordreferenceService]
})
export class WordreferenceModule {}
