package model

type Comment struct {
	ID        string `json:"id"`
	PostID    string `json:"postID"`
	UserID    string `json:"userID"`
	UserName  string `json:"userName"`
	Content   string `json:"content"`
	CreateDate string `json:"createDate"`
}

type NewComment struct {
	PostID    string `json:"postID"`
	UserID    string `json:"userID"`
	UserName  string `json:"userName"`
	Content   string `json:"content"`
	CreateDate string `json:"createDate"`
}

