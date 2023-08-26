package model

type Like struct {
	ID        string `json:"id"`
	PostID    string `json:"postID"`
	UserID    string `json:"userID"`
	UserName  string `json:"userName"`
	CreateDate string `json:"createDate"`
}

type NewLike struct {
	PostID    string `json:"postID"`
	UserID    string `json:"userID"`
	UserName  string `json:"userName"`
	CreateDate string `json:"createDate"`
}

