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
}

type GetMessagesNode struct {
	Address string
	Users   []string
}

type NodeRepo interface {
	NodeExists(address string) (bool, error)
	AddNode(address string, nodeAdmin User) error
	Nodes() ([]Node, error)
	ApproveNode(nodeID string) error
	PostMessagesNodes(user User) ([]string, error)
	GetMessageNodes(user User) ([]GetMessagesNode, error)
}

type nodeRepo struct {
	db *sqlx.DB
}

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

func (r *nodeRepo) AddNode(address string, nodeAdmin User) error {
	nodeID, err := uuid.NewV4()
	if err != nil {
		return err
	}

	_, err = r.db.Exec(`
		insert into nodes(id, address, admin_id, created_at, approved_at, disabled_at) 
		VALUES ($1, $2, $3, $4, '', '')`,
		nodeID, address, nodeAdmin.ID, common.CurrentTimestamp())
	return err
}

func (r *nodeRepo) Nodes() ([]Node, error) {
	var nodes []Node
	err := r.db.Select(&nodes, `
		select id, address, admin_id, created_at, approved_at, disabled_at,
		       (select name from users where id = nodes.admin_id) admin_name
		from nodes`)
	return nodes, err
}

func (r *nodeRepo) ApproveNode(nodeID string) error {
	_, err := r.db.Exec(`
		update nodes
		set approved_at = $1
		where id = $2`,
		common.CurrentTimestamp(), nodeID)
	return err
}

func (r *nodeRepo) PostMessagesNodes(user User) ([]string, error) {
	var nodeAddresses []string
	err := r.db.Select(&nodeAddresses, `
		select n.address
		from user_nodes un
			inner join nodes n on n.id = un.node_id
		where un.user_id = $1 and un.disabled_at = '' and n.disabled_at = '';`,
		user.ID)
	if err != nil {
		return nil, err
	}

	sort.Strings(nodeAddresses)

	return nodeAddresses, nil
}

func (r *nodeRepo) GetMessageNodes(user User) ([]GetMessagesNode, error) {
	type item struct {
		NodeAddress string `db:"address"`
		UserID      string `db:"user_id"`
	}
	var items []item
	err := r.db.Select(&items, `
		select distinct n.address, f.user_id
		from friends f
			inner join user_nodes un on un.user_id = f.user_id
			inner join nodes n on n.id = un.node_id
		where (f.user_id = $1 or f.user_id in (select friend_id from friends where user_id = $1))
			and n.disabled_at = '';`,
		user.ID)
	if err != nil {
		return nil, err
	}

	nodeFriendsMap := make(map[string]map[string]struct{})
	for _, item := range items {
		if _, ok := nodeFriendsMap[item.NodeAddress]; !ok {
			nodeFriendsMap[item.NodeAddress] = make(map[string]struct{})
		}
		nodeFriendsMap[item.NodeAddress][item.UserID] = struct{}{}
	}

	nodeAddresses := make([]string, 0, len(nodeFriendsMap))
	for nodeAddress := range nodeFriendsMap {
		nodeAddresses = append(nodeAddresses, nodeAddress)
	}
	sort.Strings(nodeAddresses)

	result := make([]GetMessagesNode, len(nodeAddresses))
	for i, nodeAddress := range nodeAddresses {
		friends := make([]string, 0, len(nodeFriendsMap[nodeAddress]))
		for userID := range nodeFriendsMap[nodeAddress] {
			friends = append(friends, userID)
		}
		sort.Strings(friends)
		result[i] = GetMessagesNode{
			Address: nodeAddress,
			Users:   friends,
		}
	}

	return result, nil
}
