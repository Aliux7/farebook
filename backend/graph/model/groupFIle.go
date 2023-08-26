package model

type GroupFile struct {
	ID         string `json:"id"`
	GroupID    string `json:"groupID"`
	UserID     string `json:"userID"`
	FileName   string `json:"fileName"`
	Type       string `json:"type"`
	MediaURL   string `json:"mediaURL"`
	CreateDate string `json:"createDate"`
}

type NewGroupFile struct {
	GroupID    string `json:"groupID"`
	UserID     string `json:"userID"`
	FileName   string `json:"fileName"`
	Type       string `json:"type"`
	MediaURL   string `json:"mediaURL"`
	CreateDate string `json:"createDate"`
}
