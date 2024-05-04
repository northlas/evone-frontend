import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Chat } from 'src/app/model/chat';
import { User } from 'src/app/model/user';
import { UserChatRoom } from 'src/app/model/user-chat-room';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ChatService } from 'src/app/service/chat.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @ViewChild('input') messasgeField!: ElementRef;

  private host = environment.apiUrl;
  private socket = new SockJS(this.host + '/ws');
  private stomp = new Client({
    webSocketFactory: () => this.socket,
    onConnect: () => {
      this.subscribe();
    }
  })
  public email = this.authService.getSubject();
  public userChatRooms: UserChatRoom[] = [];
  public currentChatRoom?: UserChatRoom;

  constructor(private chatService: ChatService, private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.stomp.activate();
    this.getChatRooms();
  }

  public getChatRooms() {
    this.chatService.getAllChatRoom(this.email).subscribe({
      next: (response: UserChatRoom[]) => {
        this.userChatRooms = response;
        this.sortChatRoom();
      }
    })
  }

  public sortChatRoom() {
    console.log(this.userChatRooms[0].chatRoom.chats[0])
    this.userChatRooms = this.userChatRooms.sort((a, b) => {
      if (a.chatRoom.chats.length > 0 && b.chatRoom.chats.length > 0) {
        return new Date(b.chatRoom.chats[0].createdDt).getTime() - new Date(a.chatRoom.chats[0].createdDt).getTime();
      }
      else {
        return b.chatRoom.chats.length - a.chatRoom.chats.length
      }
    })
  }

  public subscribe() {
    this.stomp.subscribe(`/user/${this.email}/queue/messages`, (message) => {
      const chat: Chat = JSON.parse(message.body);
      this.userChatRooms.forEach(chatRoom => {
        if (chatRoom.recipient.email == chat.sender) {
          chatRoom.chatRoom.chats.unshift(chat);
          this.sortChatRoom();
          return;
        }
      })
    });
  }

  public openChat(chatRoom: UserChatRoom) {
    this.currentChatRoom = chatRoom;
  }

  public sendMessage(chatRoomId: string, recipient: string) {
    const chat: Chat = {
      chatRoomId: chatRoomId,
      message: this.messasgeField.nativeElement.value,
      recipient: recipient,
      sender: this.email,
      createdDt: new Date()
    }
    chat.createdDt.toJSON = () => new Date(chat.createdDt.getTime() - (chat.createdDt.getTimezoneOffset() * 60000)).toJSON();
    this.stomp.publish({destination: '/app/chat', body: JSON.stringify(chat)})
    this.messasgeField.nativeElement.value = null;
    this.userChatRooms.forEach(chatRoom => {
      if (chatRoom.chatRoomId == chatRoomId) {
        chatRoom.chatRoom.chats.unshift(chat);
        this.sortChatRoom();
        return;
      }
    })
  }
}
