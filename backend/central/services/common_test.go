package services_test

import (
	"bytes"
	"context"
	"io"
	"io/ioutil"
	"os"
	"sync"

	"github.com/jmoiron/sqlx"

	"github.com/mreider/koto/backend/central/migrate"
	"github.com/mreider/koto/backend/common"
)

var (
	dbOnce          sync.Once
	sourceDBContent []byte
)

type TestEnvironment struct {
	tempDir string
	db      *sqlx.DB
	ctx     context.Context
}

func NewTestEnvironment() *TestEnvironment {
	tempDir, err := ioutil.TempDir("", "")
	if err != nil {
		panic(err)
	}

	te := &TestEnvironment{
		tempDir: tempDir,
		ctx:     context.Background(),
	}

	te.db = te.newTestDB()
	return te
}

func (te *TestEnvironment) Cleanup() {
	_ = os.RemoveAll(te.tempDir)
}

func (te *TestEnvironment) newTestDB() *sqlx.DB {
	dbOnce.Do(func() {
		db, dbPath := te.cloneTestDB(nil)
		err := db.Close()
		if err != nil {
			panic(err)
		}
		sourceDBContent, err = ioutil.ReadFile(dbPath)
		if err != nil {
			panic(err)
		}
	})

	db, _ := te.cloneTestDB(sourceDBContent)
	return db
}

func (te *TestEnvironment) cloneTestDB(dbContent []byte) (*sqlx.DB, string) {
	tempFile, err := ioutil.TempFile(te.tempDir, "*.db")
	if err != nil {
		panic(err)
	}
	_, err = io.Copy(tempFile, bytes.NewReader(dbContent))
	if err != nil {
		panic(err)
	}
	err = tempFile.Close()
	if err != nil {
		panic(err)
	}

	dbPath := tempFile.Name()
	db, _, err := common.OpenDatabase(dbPath, migrate.Migrate)
	if err != nil {
		panic(err)
	}

	return db, dbPath
}
