package repo

import (
	"sort"

	"github.com/jmoiron/sqlx"
)

type Community struct {
	Address string   `json:"address"`
	Friends []string `json:"friends"`
}

type RelationRepo interface {
	Friends(user User) ([]User, error)
	InvitedCommunities(user User) ([]string, error)
	RelatedCommunities(user User) ([]Community, error)
}

type relationRepo struct {
	db *sqlx.DB
}

func NewRelations(db *sqlx.DB) RelationRepo {
	return &relationRepo{
		db: db,
	}
}

func (r *relationRepo) Friends(user User) ([]User, error) {
	var friends []User
	err := r.db.Select(&friends, `
		select id, name
		from users
		where id in (
			select user2_id
			from relations
			where user1_id = $1)`,
		user.ID)
	if err != nil {
		return nil, err
	}
	return friends, nil
}

func (r *relationRepo) InvitedCommunities(user User) ([]string, error) {
	var communities []string
	err := r.db.Select(&communities, `
		select distinct community
		from relations
		where user1_id = $1;`,
		user.ID)
	if err != nil {
		return nil, err
	}

	sort.Strings(communities)

	return communities, nil
}

func (r *relationRepo) RelatedCommunities(user User) ([]Community, error) {
	type communityItem struct {
		Community string `db:"community"`
		UserID    string `db:"user_id"`
	}
	var communityItems []communityItem
	err := r.db.Select(&communityItems, `
		select distinct community, user1_id as user_id
		from relations
		where user1_id = $1
			or user1_id in (select user2_id from relations where user1_id = $1);`,
		user.ID)
	if err != nil {
		return nil, err
	}

	communityFriendsMap := make(map[string]map[string]struct{})
	for _, item := range communityItems {
		if _, ok := communityFriendsMap[item.Community]; !ok {
			communityFriendsMap[item.Community] = make(map[string]struct{})
		}
		communityFriendsMap[item.Community][item.UserID] = struct{}{}
	}

	communities := make([]string, 0, len(communityFriendsMap))
	for community := range communityFriendsMap {
		communities = append(communities, community)
	}
	sort.SliceStable(communities, func(i, j int) bool {
		return len(communityFriendsMap[communities[i]]) > len(communityFriendsMap[communities[j]])
	})

	result := make([]Community, len(communities))
	for i, community := range communities {
		friends := make([]string, 0, len(communityFriendsMap[community]))
		for userID := range communityFriendsMap[community] {
			friends = append(friends, userID)
		}
		sort.Strings(friends)
		result[i] = Community{
			Address: community,
			Friends: friends,
		}
	}

	return result, nil
}
