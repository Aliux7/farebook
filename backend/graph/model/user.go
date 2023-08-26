package model

import "golang.org/x/crypto/bcrypt"

type User struct {
	ID             string `json:"id"`
	ProfilePicture string `json:"profilePicture"`
	FirstName      string `json:"firstName"`
	SurName        string `json:"surName"`
	Email          string `json:"email" gorm:"unique"`
	Password       string `json:"password"`
	Dob            string `json:"dob"`
	Gender         string `json:"gender"`
	Activate       bool   `json:"activate"`
}

type NewUser struct {
	ProfilePicture string `json:"profilePicture"`
	FirstName      string `json:"firstName"`
	SurName        string `json:"surName"`
	Email          string `json:"email" gorm:"unique"`
	Password       string `json:"password"`
	Dob            string `json:"dob"`
	Gender         string `json:"gender"`
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
