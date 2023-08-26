package model

type Notification struct {
	ID        string `json:"id"`
	UserID    string `json:"userID"`
	Content   string `json:"content"`
	CreateDate string `json:"createDate"`
	Status    string `json:"status"`
}

type NewNotification struct {
	UserID    string `json:"userID"`
	Content   string `json:"content"`
	CreateDate string `json:"createDate"`
	Status    string `json:"status"`
}

