package model

type GroupChat struct {
	ID        string `json:"id"`
	CreatedAt string `json:"createdAt"`
}

type GroupChatMember struct {
	ID        string `json:"id"`
	ChatID    string `json:"chatID"`
	UserID    string `json:"userId"`
	CreatedAt string `json:"createdAt"`
}

type GroupChatMessage struct {
	ID        string `json:"id"`
	ChatID    string `json:"chatID"`
	Sender    string `json:"sender"`
	Content   string `json:"content"`
	Timestamp string `json:"timestamp"`
}

type NewGroupChatMember struct {
	ChatID    string `json:"chatID"`
	UserID    string `json:"userId"`
}

type NewGroupChatMessage struct {
	ID        string `json:"id"`
	ChatID    string `json:"chatID"`
	Sender    string `json:"sender"`
	Content   string `json:"content"`
	Timestamp string `json:"timestamp"`
}
