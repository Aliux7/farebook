package model

type Friend struct {
	ID            string `json:"id"`
	UserID        string `json:"userID"`
	FriendID      string `json:"friendID"`
	Status        string `json:"status"`
	CreateDate    string `json:"createDate"`
}

type NewFriend struct {
	UserID        string `json:"userID"`
	FriendID      string `json:"friendID"`
	Status        string `json:"status"`
	CreateDate    string `json:"createDate"`
}
