package repo

import (
	"database/sql"
	"errors"
	"sort"

	"github.com/gofrs/uuid"
	"github.com/jmoiron/sqlx"

	"github.com/mreider/koto/backend/common"
)

type Node struct {
	ID         string `db:"id"`
	Address    string `db:"address"`
	AdminID    string `db:"admin_id"`
	AdminName  string `db:"admin_name"`
	CreatedAt  string `db:"created_at"`
	ApprovedAt string `db:"approved_at"`
	DisabledAt string `db:"disabled_at"`
	Details    string `db:"details"`
}

type UserNode struct {
	Node        Node
	MinDistance int
	Count       int
}

type NodeRepo interface {
	NodeExists(address string) (bool, error)
	AddNode(address, details string, nodeAdmin User) error
	AllNodes() ([]Node, error)
	Nodes(user User) ([]Node, error)
	Node(nodeID string) (*Node, error)
	ApproveNode(nodeID string) error
	RemoveNode(nodeID string) error
	ConnectedNodes(user User) ([]UserNode, []string, error)
}

type nodeRepo struct {
	db *sqlx.DB
}

var (
	ErrNodeNotFound = errors.New("node not found")
)

func NewNodes(db *sqlx.DB) NodeRepo {
	return &nodeRepo{
		db: db,
	}
}

func (r *nodeRepo) NodeExists(address string) (bool, error) {
	var nodeID string
	err := r.db.Get(&nodeID, `select id from nodes where address = $1`,
		address)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

func (r *nodeRepo) AddNode(address, details string, nodeAdmin User) error {
	nodeID, err := uuid.NewV4()
	if err != nil {
		return err
	}

	_, err = r.db.Exec(`
		insert into nodes(id, address, admin_id, created_at, approved_at, disabled_at, details) 
		VALUES ($1, $2, $3, $4, '', '', $5)`,
		nodeID, address, nodeAdmin.ID, common.CurrentTimestamp(), details)
	return err
}

func (r *nodeRepo) AllNodes() ([]Node, error) {
	var nodes []Node
	err := r.db.Select(&nodes, `
		select id, address, admin_id, created_at, approved_at, disabled_at, details,
		       (select name from users where id = nodes.admin_id) admin_name
		from nodes`)
	return nodes, err
}

func (r *nodeRepo) Nodes(user User) ([]Node, error) {
	var nodes []Node
	err := r.db.Select(&nodes, `
		select id, address, admin_id, created_at, approved_at, disabled_at, details,
			   (select name from users where id = nodes.admin_id) admin_name
		from nodes
		where admin_id = $1`, user.ID)
	return nodes, err
}

func (r *nodeRepo) Node(nodeID string) (*Node, error) {
	var node Node
	err := r.db.Get(&node, `
		select id, address, admin_id, created_at, approved_at, disabled_at, details
		from nodes
		where id = $1`, nodeID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrNodeNotFound
		}
		return nil, err
	}

	return &node, nil
}

func (r *nodeRepo) ApproveNode(nodeID string) error {
	_, err := r.db.Exec(`
		update nodes
		set approved_at = $1
		where id = $2`,
		common.CurrentTimestamp(), nodeID)
	return err
}

func (r *nodeRepo) RemoveNode(nodeID string) error {
	_, err := r.db.Exec(`
		delete from nodes
		where id = $1`,
		nodeID)
	return err
}

func (r *nodeRepo) ConnectedNodes(user User) (userNodes []UserNode, userIDs []string, err error) {
	type friend struct {
		MinDistance int
		Count       int
	}
	type friendPair struct {
		UserID   string `db:"user_id"`
		FriendID string `db:"friend_id"`
	}
	currentLevel := []string{user.ID}
	nextPairs := make([]friendPair, 0)
	friends := map[string]friend{user.ID: {MinDistance: 0, Count: 1}}
	friendPairs := map[friendPair]struct{}{}
	distance := 0
	for len(currentLevel) > 0 {
		nextPairs = nextPairs[:0]
		distance++
		query, args, err := sqlx.In(`
			select user_id, friend_id
			from friends
			where user_id in (?)`,
			currentLevel)
		if err != nil {
			return nil, nil, err
		}
		query = r.db.Rebind(query)
		err = r.db.Select(&nextPairs, query, args...)
		if err != nil {
			return nil, nil, err
		}

		currentLevel = currentLevel[:0]
		for _, pair := range nextPairs {
			if _, ok := friendPairs[pair]; ok {
				continue
			}
			if _, ok := friendPairs[friendPair{UserID: pair.FriendID, FriendID: pair.UserID}]; ok {
				continue
			}
			friendPairs[pair] = struct{}{}
			if f, ok := friends[pair.FriendID]; !ok {
				friends[pair.FriendID] = friend{MinDistance: distance, Count: 1}
				currentLevel = append(currentLevel, pair.FriendID)
			} else {
				friends[pair.FriendID] = friend{MinDistance: f.MinDistance, Count: f.Count + 1}
			}
		}
	}

	userIDs = make([]string, 0, len(friends))
	for friendID := range friends {
		userIDs = append(userIDs, friendID)
	}
	sort.Strings(userIDs)

	var nodes []Node
	err = r.db.Select(&nodes, `
		select id, address, admin_id, created_at, approved_at, disabled_at, details
		from nodes
		where approved_at <> '' and disabled_at = ''`)
	if err != nil {
		return nil, nil, err
	}

	userNodes = make([]UserNode, 0, 10)
	for _, node := range nodes {
		if friend, ok := friends[node.AdminID]; ok {
			userNodes = append(userNodes, UserNode{
				Node:        node,
				MinDistance: friend.MinDistance,
				Count:       friend.Count,
			})
		}
	}

	return userNodes, userIDs, nil
}
