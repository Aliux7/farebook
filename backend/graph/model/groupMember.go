package model

type GroupMember struct {
	ID         string `json:"id"`
	GroupID string `json:"groupID"`
	UserID     string `json:"userID"`
	Role       string `json:"role"`
}

type NewGroupMember struct {
	GroupID string `json:"groupID"`
	UserID     string `json:"userID"`
	Role       string `json:"role"`
}

type PendingGroupMember struct {
	ID         string `json:"id"`
	GroupID string `json:"groupID"`
	UserID     string `json:"userID"`
}

type NewPendingGroupMember struct {
	GroupID string `json:"groupID"`
	UserID     string `json:"userID"`
}