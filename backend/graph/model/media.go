package model

type Media struct {
	ID        string `json:"id"`
	PostID	  string `json:"postID"`
	MediaURL  string `json:"mediURL"`
}

type NewMedia struct {
	PostID	  string `json:"postID"`
	MediaURL  string `json:"mediURL"`
}
