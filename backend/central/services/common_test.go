package services_test

import (
	"context"
	"fmt"
	"io/ioutil"
	"os"
	"sync"
	"time"

	"github.com/jmoiron/sqlx"

	"github.com/mreider/koto/backend/central/migrate"
	"github.com/mreider/koto/backend/common"
)

var (
	dbOnce            sync.Once
	templateDBName    string
	defaultDBSettings = common.DatabaseConfig{
		Host:     "localhost",
		Port:     5433,
		User:     "postgres",
		Password: "docker",
		SSLMode:  "disable",
	}
)

type TestEnvironment struct {
	name    string
	dbName  string
	tempDir string
	db      *sqlx.DB
	ctx     context.Context
}

func NewTestEnvironment(name string) *TestEnvironment {
	tempDir, err := ioutil.TempDir("", "")
	if err != nil {
		panic(err)
	}

	te := &TestEnvironment{
		name:    name,
		tempDir: tempDir,
		ctx:     context.Background(),
	}

	te.db, te.dbName = te.newTestDB()
	return te
}

func (te *TestEnvironment) Cleanup() {
	_ = os.RemoveAll(te.tempDir)
	_ = te.db.Close()

	dbSettings := defaultDBSettings
	dbSettings.DBName = common.MasterDBName

	db, _, err := common.OpenDatabase(dbSettings)
	if err != nil {
		panic(err)
	}
	defer func() { _ = db.Close() }()

	_, err = db.Exec(fmt.Sprintf("drop database %s;", te.dbName))
	if err != nil {
		panic(err)
	}
}

func (te *TestEnvironment) newTestDB() (*sqlx.DB, string) {
	dbOnce.Do(func() {
		templateDBName = te.createTemplateDB()
	})

	return te.cloneTemplateDB()
}

func (te *TestEnvironment) cloneTemplateDB() (*sqlx.DB, string) {
	dbSettings := defaultDBSettings
	dbSettings.DBName = common.MasterDBName

	db, _, err := common.OpenDatabase(dbSettings)
	if err != nil {
		panic(err)
	}
	defer func() { _ = db.Close() }()

	dbName := fmt.Sprintf("test_%d", time.Now().UnixNano())

	_, err = db.Exec(fmt.Sprintf(`create database "%s" template %s;`, dbName, templateDBName))
	if err != nil {
		panic(err)
	}

	dbSettings.DBName = dbName
	tesDB, _, err := common.OpenDatabase(dbSettings)
	if err != nil {
		panic(err)
	}

	return tesDB, dbName
}

func (te *TestEnvironment) createTemplateDB() string {
	dbSettings := defaultDBSettings
	dbSettings.DBName = common.MasterDBName

	db, _, err := common.OpenDatabase(dbSettings)
	if err != nil {
		panic(err)
	}
	defer func() { _ = db.Close() }()

	templateDBName := fmt.Sprintf("test_template_%s", te.name)

	_, _ = db.Exec(fmt.Sprintf("drop database %s;", templateDBName))

	_, err = db.Exec(fmt.Sprintf(`create database "%s";`, templateDBName))
	if err != nil {
		panic(err)
	}

	dbSettings.DBName = templateDBName
	templateDB, _, err := common.OpenDatabase(dbSettings, migrate.Migrate)
	if err != nil {
		panic(err)
	}
	defer func() { _ = templateDB.Close() }()

	return templateDBName
}
