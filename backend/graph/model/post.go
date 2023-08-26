package model

type Post struct {
	ID        string `json:"id"`
	UserID	  string `json:"userID"`
	UserName  string `json:"userName"`
	DatePost  string `json:"datePost"`
	TextPost  string `json:"textPost"`
	Privacy   string `json:"privacy"`
}

type NewPost struct {
	UserID	  string `json:"userID"`
	UserName  string `json:"userName"`
	DatePost  string `json:"datePost"`
	TextPost  string `json:"textPost"`
	Privacy   string `json:"privacy"`
}
