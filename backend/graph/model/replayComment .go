package model

type ReplayComment struct {
	ID        string `json:"id"`
	CommentID    string `json:"commentID"`
	UserID    string `json:"userID"`
	UserName  string `json:"userName"`
	Content   string `json:"content"`
	CreateDate string `json:"createDate"`
}

type NewReplayComment struct {
	CommentID    string `json:"commentID"`
	UserID    string `json:"userID"`
	UserName  string `json:"userName"`
	Content   string `json:"content"`
	CreateDate string `json:"createDate"`
}

