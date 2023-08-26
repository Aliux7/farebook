package model

type Reels struct {
	ID        string `json:"id"`
	UserID    string `json:"userID"`
	UserName  string `json:"userName"`
	DateReels string `json:"dateReels"`
	TextReels string `json:"textReels"`
	VideoURL  string `json:"videoURL"`
	Privacy   string `json:"privacy"`
}

type NewReels struct {
	UserID    string `json:"userID"`
	UserName  string `json:"userName"`
	DateReels string `json:"dateReels"`
	TextReels string `json:"textReels"`
	VideoURL  string `json:"videoURL"`
	Privacy   string `json:"privacy"`
}
