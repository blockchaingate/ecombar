import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class AirdropService {
    constructor(private http: HttpService) { }
    
    getQuestionair(address: string, ip: string) {
        const url = 'airdrop/getQuestionair/' + address + '/' + ip;
        return this.http.get(url);
    }

    answerQuestionair(address: string, questionair_id: string, answer: string) {
        const data = {
            address: address,
            questionair_id: questionair_id,
            answer: answer
        };
        const url = 'airdrop/answerQuestionair';
        return this.http.post(url, data);       
    }    
}