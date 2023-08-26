package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.35

import (
	"context"
	"time"

	"github.com/Aliux7/WEB-KS-231/graph/model"
	"github.com/google/uuid"
)

// CreateComment is the resolver for the createComment field.
func (r *mutationResolver) CreateComment(ctx context.Context, inputComment model.NewComment) (*model.Comment, error) {
	now := time.Now()
	comment := &model.Comment{
		ID:         uuid.NewString(),
		PostID:     inputComment.PostID,
		UserID:     inputComment.UserID,
		UserName:   inputComment.UserName,
		Content:    inputComment.Content,
		CreateDate: now.Format("2006-01-02 15:04:05"),
	}

	return comment, r.DB.Save(&comment).Error
}

// GetAllCommentByPost is the resolver for the getAllCommentByPost field.
func (r *queryResolver) GetAllCommentByPost(ctx context.Context, id string) ([]*model.Comment, error) {
	var comments []*model.Comment
	err := r.DB.Where("post_id = ?", id).Find(&comments).Error
	if err != nil {
		return nil, err
	}
	return comments, nil
}

// CountAllCommentByPost is the resolver for the countAllCommentByPost field.
func (r *queryResolver) CountAllCommentByPost(ctx context.Context, id string) (int, error) {
	var count int64
	err := r.DB.Model(model.Comment{}).
		Where("post_id = ?", id).
		Count(&count).Error

	if err != nil {
		return 0, err
	}

	return int(count), nil
}