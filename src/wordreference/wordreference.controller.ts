import { Get, Param, Query } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { ConjJSON } from 'src/types/ConjJSON.interface';
import { WordreferenceService } from './wordreference.service';

@Controller('wordreference')
export class WordreferenceController {
    constructor(private readonly service: WordreferenceService){}

    @Get('/:lang/:word')
    async getHTML(
        @Param('word') word: string, 
        @Param('lang') lang: string
    ): Promise<string> {
        try{
            return await this.service.findHTML(word, lang);
        } catch (e) {
            return e.message;
        }
    }

    @Get('json/:lang/:word')
    async getJSON(
        @Param('word') word: string, 
        @Param('lang') lang: string,
        @Query('mode') mode?: string,
        @Query('time') time?: string,
        @Query('person') person?: string
    ): Promise<ConjJSON> {
        try {
            return await this.service.findJSON(word, lang, mode || '', time || '', person || '');
        } catch (e) {
            throw new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }
}
