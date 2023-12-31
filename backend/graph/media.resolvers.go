package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.35

import (
	"context"

	"github.com/Aliux7/WEB-KS-231/graph/model"
	"github.com/google/uuid"
)

// CreateMedia is the resolver for the createMedia field.
func (r *mutationResolver) CreateMedia(ctx context.Context, inputMedia model.NewMedia) (*model.Media, error) {
	media := &model.Media{
		ID:       uuid.NewString(),
		PostID:   inputMedia.PostID,
		MediaURL: inputMedia.MediaURL,
	}

	return media, r.DB.Save(&media).Error
}

// GetAllMediaByPost is the resolver for the getAllMediaByPost field.
func (r *queryResolver) GetAllMediaByPost(ctx context.Context, id string) ([]*model.Media, error) {
	var medias []*model.Media

	if err := r.DB.Where("post_id = ?", id).Find(&medias).Error; err != nil {
		return nil, err
	}

	return medias, nil
}
