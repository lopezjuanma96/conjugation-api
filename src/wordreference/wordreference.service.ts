import { HttpService } from '@nestjs/axios';
import { ConjJSON } from 'src/types/ConjJSON.interface';
import { Injectable } from '@nestjs/common';
import parse from 'node-html-parser';

@Injectable()
export class WordreferenceService {
    constructor(private readonly httpService: HttpService){}

    async findHTML(word: string, lang: string): Promise<string>{
        return new Promise((resolve, reject) => {
            this.httpService.axiosRef.get(`https://www.wordreference.com/conj/${lang}verbs.aspx?v=${word}`)
            .then((res) => {
                if (res.headers['content-type'].includes('text/html')) resolve(res.data)
                else reject(`Content-type of response is not HTML but ${res.headers['content-type']}`)
            })
        })
    }

    async findJSON(word: string, lang: string, mode: string, time: string, person: string): Promise<ConjJSON>{
        return new Promise((resolve, reject) => {
            this.findHTML(word, lang)
            .then(res => {
                const parsed = parse(res)
                parsed.querySelectorAll('.aa').forEach(e => {
                    if (e.getElementsByTagName('h4').some(h => h.textContent.toLowerCase() === mode.toLowerCase())){
                        e.getElementsByTagName('th').forEach(t => {
                            if (t.getAttribute('scope') === 'col' && t.textContent.split('ⓘ')[0].toLowerCase() === time.toLowerCase()) {
                                const timeRow = t.parentNode;
                                var conjRow = timeRow.nextElementSibling;
                                while (conjRow){
                                    const conj = conjRow.getElementsByTagName('th')[0]
                                    if(conj.getAttribute('scope') === 'row' && conj.textContent.toLowerCase() === person.toLowerCase()){
                                        resolve({
                                            word,
                                            conj: conj.nextElementSibling.textContent,
                                            src: 'wordreference', lang, mode, time, person
                                        })
                                    }
                                    conjRow = conjRow.nextElementSibling;
                                }
                                reject(`nonexisting-person: ${person}`)
                            }
                        })
                        reject(`nonexisting-time: ${time}`);
                    }
                })
                reject(`nonexisting-mode: ${mode}`);
            })
        })
    }
}
