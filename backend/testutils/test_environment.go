package testutils

import (
	"fmt"
	"sync"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"

	"github.com/mreider/koto/backend/common"
)

var (
	dbOnce         sync.Once
	templateDBName string

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
	DB      *sqlx.DB
	dbName  string
	Storage *common.S3Storage
}

func NewTestEnvironment(name string, migrate func(db *sqlx.DB, dialect string) (n int, err error)) *TestEnvironment {
	minioClient, err := minio.New("localhost:9000", &minio.Options{
		Creds:  credentials.NewStaticV4("access_key", "secret_key", ""),
		Region: "us-east-1",
		Secure: false,
	})
	if err != nil {
		panic(err)
	}

	storage := common.NewS3Storage(minioClient, nil, "", "test-bucket")

	te := &TestEnvironment{
		name:    name,
		Storage: storage,
	}

	te.DB, te.dbName = te.newTestDB(migrate)

	return te
}

func (te *TestEnvironment) Cleanup() {
	dbSettings := defaultDBSettings
	dbSettings.DBName = common.MasterDBName

	db, _, err := common.OpenDatabase(dbSettings)
	if err != nil {
		panic(err)
	}
	defer func() { _ = db.Close() }()

	_, err = db.Exec(fmt.Sprintf("drop database %s with (force);", te.dbName))
	if err != nil {
		panic(err)
	}
}

func (te *TestEnvironment) newTestDB(migrate func(db *sqlx.DB, dialect string) (n int, err error)) (*sqlx.DB, string) {
	dbOnce.Do(func() {
		templateDBName = te.createTemplateDB(migrate)
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

	_, err = db.Exec(fmt.Sprintf("create database %s template %s;", dbName, templateDBName))
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

func (te *TestEnvironment) createTemplateDB(migrate func(db *sqlx.DB, dialect string) (n int, err error)) string {
	dbSettings := defaultDBSettings
	dbSettings.DBName = common.MasterDBName

	db, _, err := common.OpenDatabase(dbSettings)
	if err != nil {
		panic(err)
	}
	defer func() { _ = db.Close() }()

	templateDBName := fmt.Sprintf("test_template_%s", te.name)

	_, _ = db.Exec(fmt.Sprintf("drop database %s with (force);", templateDBName))

	_, err = db.Exec(fmt.Sprintf("create database %s;", templateDBName))
	if err != nil {
		panic(err)
	}

	dbSettings.DBName = templateDBName
	templateDB, _, err := common.OpenDatabase(dbSettings, migrate)
	if err != nil {
		panic(err)
	}
	defer func() { _ = templateDB.Close() }()

	return templateDBName
}
