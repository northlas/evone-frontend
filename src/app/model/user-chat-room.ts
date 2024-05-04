import { ChatRoom } from "./chat-room"
import { User } from "./user"

export interface UserChatRoom {
  email: string,
  chatRoomId: string,
  chatRoom: ChatRoom,
  recipient: User,
  createdDt?: Date
}
