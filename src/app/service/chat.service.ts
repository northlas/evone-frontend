import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { UserChatRoom } from '../model/user-chat-room';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getAllChatRoom(email: string): Observable<UserChatRoom[]> {
    return this.http.get<UserChatRoom[]>(`${this.host}/api/messages/${email}`);
  }
}
