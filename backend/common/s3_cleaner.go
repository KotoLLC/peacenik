package common

import (
	"context"
	"log"
	"time"

	"github.com/jmoiron/sqlx"
)

const (
	cleanInterval = time.Second * 10
)

type S3Cleaner struct {
	db        *sqlx.DB
	s3Storage *S3Storage
}

func NewS3Cleaner(db *sqlx.DB, s3Storage *S3Storage) *S3Cleaner {
	return &S3Cleaner{
		db:        db,
		s3Storage: s3Storage,
	}
}

func (c *S3Cleaner) Clean(ctx context.Context) {
	ticker := time.NewTicker(cleanInterval)
	defer ticker.Stop()

	c.clean(ctx)
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			c.clean(ctx)
		}
	}
}

func (c *S3Cleaner) clean(ctx context.Context) {
	var pendingDeletes []struct {
		ID     string `db:"id"`
		BlobID string `db:"blob_id"`
	}
	err := c.db.SelectContext(ctx, &pendingDeletes, `
		select id, blob_id
		from blob_pending_deletes`)
	if err != nil {
		log.Println(err)
	}
	for _, item := range pendingDeletes {
		exists, err := c.s3Storage.Exists(ctx, item.BlobID)
		if err != nil {
			log.Println(err)
			continue
		}
		if exists {
			err = c.s3Storage.RemoveObject(ctx, item.BlobID)
			if err != nil {
				log.Println(err)
				continue
			}
		}
		_, err = c.db.ExecContext(ctx, `
			delete from blob_pending_deletes
			where id = $1`, item.ID)
		if err != nil {
			log.Println(err)
		}
	}
}
