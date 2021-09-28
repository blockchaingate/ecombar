import { Component, OnInit } from '@angular/core';
import { ChatService } from "../../../../services/chat.service";

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
    this.chatService.messages.subscribe(msg => {
      console.log("Response from websocket: " + msg);
    });
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
    this.chatService.messages.next(this.message);
    this.message.message = "";
  }
}
