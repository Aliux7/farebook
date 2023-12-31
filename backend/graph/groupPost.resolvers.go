package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.35

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/Aliux7/WEB-KS-231/graph/model"
	"github.com/google/uuid"
)

// CreateGroupPost is the resolver for the createGroupPost field.
func (r *mutationResolver) CreateGroupPost(ctx context.Context, inputGroupPost model.NewGroupPost) (*model.GroupPost, error) {
	now := time.Now()
	groupPost := &model.GroupPost{
		ID:        uuid.NewString(),
		GroupID:   inputGroupPost.GroupID,
		GroupName: inputGroupPost.GroupName,
		UserID:    inputGroupPost.UserID,
		UserName:  inputGroupPost.UserName,
		DatePost:  now.Format("2006-01-02 15:04:05"),
		TextPost:  inputGroupPost.TextPost,
		Privacy:   inputGroupPost.Privacy,
	}

	return groupPost, r.DB.Save(&groupPost).Error
}

// DeleteGroupPost is the resolver for the deleteGroupPost field.
func (r *mutationResolver) DeleteGroupPost(ctx context.Context, id string) (*model.GroupPost, error) {
	var groupPost *model.GroupPost

	if err := r.DB.First(&groupPost, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return groupPost, r.DB.Delete(&groupPost).Error
}

// GetGroupPost is the resolver for the getGroupPost field.
func (r *queryResolver) GetGroupPost(ctx context.Context, id string) (*model.GroupPost, error) {
	panic(fmt.Errorf("not implemented: GetGroupPost - getGroupPost"))
}

// GetAllGroupPost is the resolver for the getAllGroupPost field.
func (r *queryResolver) GetAllGroupPost(ctx context.Context, id string, offset *int, limit *int) ([]*model.GroupPost, error) {
	panic(fmt.Errorf("not implemented: GetAllGroupPost - getAllGroupPost"))
}

// SearchAllGroupPost is the resolver for the searchAllGroupPost field.
func (r *queryResolver) SearchAllGroupPost(ctx context.Context, search string, offset *int, limit *int) ([]*model.GroupPost, error) {
	var groupPosts []*model.GroupPost

	query := r.DB

	if search != "" {
		query = query.Where("LOWER(text_post) LIKE ?", "%"+strings.ToLower(search)+"%")
	}

	if offset != nil && *offset > 0 {
		query = query.Offset(*offset)
	}

	if limit != nil && *limit > 0 {
		query = query.Limit(*limit)
	}

	if err := query.Find(&groupPosts).Error; err != nil {
		return nil, err
	}

	return groupPosts, nil
}
