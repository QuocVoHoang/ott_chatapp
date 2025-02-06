interface IMessage {
  _id?: string
  content: string
  conversation_id: string
  created_at?: string
  updated_at?: string
  sender: string
  type?: string
}