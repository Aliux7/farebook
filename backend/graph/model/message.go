package model

type Chat struct {
	ID	string `json:"id"`
	UserID1 string `json:"userID1"`
	UserID2 string `json:"userID2"`
	CreatedAt string `json:"createdAt"`
}

type NewChat struct {
	UserID1 string `json:"userID1"`
	UserID2 string `json:"userID2"`
}

type Message struct {
	ID        string `json:"id"`
	ChatID    string `json:"chatID"`
	Sender    string `json:"sender"`
	Content   string `json:"content"`
	Timestamp string `json:"timestamp"`
}

type NewMessage struct {
	ChatID    string `json:"chatID"`
	Sender  string `json:"sender"`
	Content string `json:"content"`
}
