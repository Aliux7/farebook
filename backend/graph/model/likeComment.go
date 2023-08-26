package model

type LikeComment struct {
	ID        string `json:"id"`
	CommentID    string `json:"commentID"`
	UserID    string `json:"userID"`
	UserName  string `json:"userName"`
	CreateDate string `json:"createDate"`
}

type NewLikeComment struct {
	CommentID    string `json:"commentID"`
	UserID    string `json:"userID"`
	UserName  string `json:"userName"`
	CreateDate string `json:"createDate"`
}

