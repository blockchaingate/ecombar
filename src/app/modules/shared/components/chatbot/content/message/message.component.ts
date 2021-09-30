import { Component, OnInit } from '@angular/core';
import { ChatService } from "../../../../services/chat.service";
import { catchError, tap, map } from 'rxjs/operators'

@Component({
  selector: 'app-chatbot-content-message',
  templateUrl: './message.component.html',
  styleUrls: [
    './message.component.scss'
  ]
})
export class ChatbotContentMessageComponent implements OnInit {
  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    /*
    this.chatService.messages.subscribe(msg => {
      console.log("Response from websocket: " + msg);
    });
    */
    this.chatService.connect();
    const liveData$ = this.chatService.messages$.pipe(
      map((rows: any) => rows.data),
      catchError(error => { throw error }),
      tap({
        error: error => console.log('[Live component] Error:', error),
        complete: () => console.log('[Live component] Connection Closed')
      }
      )
    );
  }

  private message = {
    author: "tutorialedge",
    message: "this is a test message"
  };

  sendMsg() {
    this.message = {
      author: "tutorialedge",
      message: "this is a test message"
    };
    console.log("new message from client to websocket: ", this.message);
    this.chatService.sendMessage('fdfwaewa');
    this.message.message = "";
  }
}
