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
                //base modes: infinitive, participle, etc
                const baseModeList = parsed.getElementById('cheader').getElementsByTagName('td')[0]
                const baseModeIndex = baseModeList.getElementsByTagName('strong')[0].innerHTML.split('<br>').findIndex(m => this.compareTexts(m, mode))
                if(baseModeIndex >= 0) resolve({
                    word,
                    conj: this.processText(baseModeList.nextElementSibling.innerHTML.split('<br>')[baseModeIndex]),
                    src: 'wordreference', lang, mode, time, person
                })
                //complex modes, with time and person: indicative, subjunctive, etc
                parsed.querySelectorAll('.aa').forEach(e => {
                    if (e.getElementsByTagName('h4').some(h => this.compareTexts(h.textContent, mode))){
                        e.getElementsByTagName('th').forEach(t => {
                            if (this.compareTexts(t.getAttribute('scope'), 'col') && this.compareTexts(t.textContent.split('ⓘ')[0], time)) {
                                const timeRow = t.parentNode;
                                var conjRow = timeRow.nextElementSibling;
                                while (conjRow){
                                    const conj = conjRow.getElementsByTagName('th')[0]
                                    if(this.compareTexts(conj.getAttribute('scope'), 'row') && this.compareTexts(conj.textContent, person)){
                                        resolve({
                                            word,
                                            conj: this.processText(conj.nextElementSibling.textContent),
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

    compareTexts(A: string, B: string){
        const A_proc = this.processText(A)
        const B_proc = this.processText(B)
        return A_proc === B_proc
    }

    processText = (T: string) => parse(T).innerText.toLowerCase().replace(/[^(A-z)(0-9)(á-ú)\s]/g, '').replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ').replace(' ', '_')
    /* 
    ProcessText Description
    - parsing + innerText: some conjugations are only separated by <br> so we need to use innerHTML in the search instead of innerText, but then inside the
    conjugation they have inner tags like <b> or <a> so we parse them back and get the inner text alone
    - toLowerCase: obvious
    - replace [many]: delete all symbols that are not spaces or words 
    - replace ^\s+|\s+$: delete trailing spaces
    - replace \s+: replaces repeated spaces with only one, mainly from last replace
    - replace ' ': changes remaining spaces with underscore for proper querying
    */
}
