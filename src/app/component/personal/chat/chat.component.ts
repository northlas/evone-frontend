import { Component, OnInit } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Chat } from 'src/app/model/chat';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  private host = environment.apiUrl;
  private socket = new SockJS(this.host + '/ws');
  private stomp = new Client({
    webSocketFactory: () => this.socket,
    onConnect: () => {
      this.subscribe();
    }
  })  
  
  constructor() {}

  ngOnInit(): void {
    this.stomp.activate();
  }

  public subscribe() {
    this.stomp.subscribe(`/user/customer2@gmail.com/queue/messages`, (message) => {
      console.log(message.body);
    });
  }

  public sendMessage(chat: Chat) {
    this.stomp.publish({destination: '/app/chat', body: JSON.stringify(chat)})
  }
}
