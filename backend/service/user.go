package service

import (
	"context"

	"github.com/Aliux7/WEB-KS-231/database"
	"github.com/Aliux7/WEB-KS-231/graph/model"
	"github.com/google/uuid"
)

func UserCreate(ctx context.Context, input model.NewUser) (*model.User, error) {
	db := database.GetDB()

	password, err := model.HashPassword(input.Password)

	if err != nil {
		return nil, err
	}

	user := &model.User{
		ID:        uuid.NewString(),
		FirstName: input.FirstName,
		SurName:   input.SurName,
		Email:     input.Email,
		Password:  password,
		Dob:       input.Dob,
		Gender:    input.Gender,
	}

	if err := db.Model(user).Create(&user).Error; err != nil {
		return nil, err
	}

	return user, nil
}

func UserGetByID(ctx context.Context, id string) (*model.User, error) {
	db := database.GetDB()

	var user model.User
	if err := db.Model(user).Where("id = ?", id).Take(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func UserGetByEmail(ctx context.Context, email string) (*model.User, error) {
	db := database.GetDB()

	var user model.User
	if err := db.Model(user).Where("email = ?", email).Take(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}
