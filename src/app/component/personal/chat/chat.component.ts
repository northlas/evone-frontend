import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Client } from '@stomp/stompjs';
import { filter } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { Chat } from 'src/app/model/chat';
import { UserChatRoom } from 'src/app/model/user-chat-room';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ChatService } from 'src/app/service/chat.service';
import { environment } from 'src/environments/environment';

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
  public isFetched = false;
  public isLoading = true;

  constructor(private chatService: ChatService, private authService: AuthenticationService, private router: Router, private location: Location) {
    router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      const navigation = router.getCurrentNavigation();
      const state = navigation?.extras.state;
      if (state && !this.isFetched) {
        console.log(state)
        this.isFetched = true;
        this.getChatRooms(true, state['recipient']);
      }
    })
  }

  ngOnInit(): void {
    this.stomp.activate();
    if(!this.isFetched) {
      this.getChatRooms(false);
    }
  }

  public getChatRooms(checkExisting: boolean, recipient?: string) {
    this.chatService.getAllChatRoom(this.email).subscribe({
      next: (response: UserChatRoom[]) => {
        if (checkExisting) {
          this.currentChatRoom = response.find((value) => value.recipient.email == recipient)
          if (!this.currentChatRoom) {
            this.chatService.addChatRoom(this.email, recipient!).subscribe({
              next: (room: UserChatRoom) => {
                this.userChatRooms = response;
                this.isLoading = false;
                this.sortChatRoom();
                this.userChatRooms.unshift(room);
                this.currentChatRoom = room;
              }
            })
          }
          else {
            this.userChatRooms = response;
            this.isLoading = false;
            this.sortChatRoom();
          }
        }
        else {
          this.userChatRooms = response;
          this.isLoading = false;
          this.sortChatRoom();
        }
      }
    })
  }

  public sortChatRoom() {
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
