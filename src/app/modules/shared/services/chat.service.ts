/*
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs/Rx";
import { WebsocketService } from "./websocket.service";

const CHAT_URL = "wss://echo.websocket.org/";
//const CHAT_URL = "wss://test.blockchaingate.com/message";
export interface Message {
  author: string;
  message: string;
}

@Injectable()
export class ChatService {
  public messages: Subject<Message>;

  constructor(wsService: WebsocketService) {
    this.messages = <Subject<Message>>wsService.connect(CHAT_URL).map(
      (response: MessageEvent): Message => {
          console.log('response===', response);
        let data = JSON.parse(response.data);
        return {
          author: data.author,
          message: data.message
        };
      }
    );
  }
}
*/


import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../../../environments/environment';
import { catchError, tap, switchAll, switchMap } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';

export const WS_ENDPOINT = environment.endpoints['ws']; 
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket$: WebSocketSubject<any>;
  private messagesSubject$ = new Subject();
  public messages$ = this.messagesSubject$.pipe(
    switchMap((value: any) => value),  // switchAll(), 
    catchError(e => { throw e })
  );
  
  public connect(): void {
  
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket();
      const messages = this.socket$.pipe(
        tap({
          error: error => console.log(error),
        }), catchError(_ => EMPTY));
      this.messagesSubject$.next(messages);
    }
  }
  
  private getNewWebSocket() {
    return webSocket(WS_ENDPOINT);
  }
  sendMessage(msg: any) {
    this.socket$.next(msg);
  }
  close() {
    this.socket$.complete(); }}
