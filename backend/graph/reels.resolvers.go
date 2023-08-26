package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.35

import (
	"context"
	"fmt"
	"time"

	"github.com/Aliux7/WEB-KS-231/graph/model"
	"github.com/google/uuid"
)

// CreateReels is the resolver for the createReels field.
func (r *mutationResolver) CreateReels(ctx context.Context, inputReels model.NewReels) (*model.Reels, error) {
	now := time.Now()
	reels := &model.Reels{
		ID:        uuid.NewString(),
		UserID:    inputReels.UserID,
		UserName:  inputReels.UserName,
		DateReels: now.Format("2006-01-02 15:04:05"),
		TextReels: inputReels.TextReels,
		VideoURL:  inputReels.VideoURL,
		Privacy:   inputReels.Privacy,
	}

	return reels, r.DB.Save(&reels).Error
}

// DeleteReels is the resolver for the deleteReels field.
func (r *mutationResolver) DeleteReels(ctx context.Context, id string) (*model.Reels, error) {
	var reels *model.Reels

	if err := r.DB.First(&reels, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return reels, r.DB.Delete(&reels).Error
}

// GetReels is the resolver for the getReels field.
func (r *queryResolver) GetReels(ctx context.Context, id string) (*model.Reels, error) {
	panic(fmt.Errorf("not implemented: GetReels - getReels"))
}

// GetAllReels is the resolver for the getAllReels field.
func (r *queryResolver) GetAllReels(ctx context.Context) ([]*model.Reels, error) {
	var reels []*model.Reels
	return reels, r.DB.Find(&reels).Error
}

// GetAllReelsByUserID is the resolver for the getAllReelsByUserID field.
func (r *queryResolver) GetAllReelsByUserID(ctx context.Context, userID string) ([]*model.Reels, error) {
	var reels []*model.Reels
	err := r.DB.Where("user_id = ?", userID).Find(&reels).Error
	if err != nil {
		return nil, err
	}
	return reels, nil
}

// SearchAllReels is the resolver for the searchAllReels field.
func (r *queryResolver) SearchAllReels(ctx context.Context, search string, offset *int, limit *int) ([]*model.Reels, error) {
	panic(fmt.Errorf("not implemented: SearchAllReels - searchAllReels"))
}
