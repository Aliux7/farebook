package model

type Group struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	Privacy    string `json:"privacy"`
	CreateDate string `json:"createDate"`
}

type NewGroup struct {
	Name       string `json:"name"`
	Privacy    string `json:"privacy"`
	CreateDate string `json:"createDate"`
}
