import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: [
    './chatbot.component.scss'
    /*
    ,
    '../../../../../assets/css/home/7.004395ae.chunk.css',
    '../../../../../assets/css/home/19.4751f621.chunk.css'
    */
  ]
})
export class ChatbotComponent implements OnInit {
  chatOpen: boolean;
  constructor() { }

  ngOnInit(): void {
    this.chatOpen = false;
  }

  toggleChatOpen() {
    this.chatOpen = !this.chatOpen;
  }
}
