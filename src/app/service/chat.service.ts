import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ChatRoom } from '../model/chat-room';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getChatRoom(): Observable<ChatRoom[]> {
    return this.http.get<ChatRoom[]>(`${this.host}/api/chat-rooms`);
  }
}
