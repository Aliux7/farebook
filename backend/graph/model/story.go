package model

type Story struct {
	ID        string `json:"id"`
	UserID	  string `json:"userID"`
	UserName  string `json:"userName"`
	DateStory  string `json:"dateStory"`
	ImageStory bool `json:"imageStory"`
	TextStory string `json:"textStory"`
	FontStory string `json:"fontStory"`
	BackgroundStory string `json:"backgroundStory"`
	Privacy   string `json:"privacy"`
}

type NewStory struct {
	UserID	  string `json:"userID"`
	UserName  string `json:"userName"`
	DateStory  string `json:"dateStory"`
	ImageStory bool `json:"imageStory"`
	TextStory string `json:"textStory"`
	FontStory string `json:"fontStory"`
	BackgroundStory string `json:"backgroundStory"`
	Privacy   string `json:"privacy"`
}

type UserDistinct struct {
	UserID   string `json:"user_id"`
	UserName string `json:"user_name"`
}
