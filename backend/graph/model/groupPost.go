package model

type GroupPost struct {
	ID        string `json:"id"`
	GroupID   string `json:"groupID"`
	GroupName string `json:"groupName"`
	UserID    string `json:"userID"`
	UserName  string `json:"userName"`
	DatePost  string `json:"datePost"`
	TextPost  string `json:"textPost"`
	Privacy   string `json:"privacy"`
}

type NewGroupPost struct {
	GroupID   string `json:"groupID"`
	GroupName string `json:"groupName"`
	UserID    string `json:"userID"`
	UserName  string `json:"userName"`
	DatePost  string `json:"datePost"`
	TextPost  string `json:"textPost"`
	Privacy   string `json:"privacy"`
}
