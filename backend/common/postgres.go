package common

import (
	"errors"
	"fmt"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq" // Nobody else knows about postgres
)

const (
	dbDialect    = "postgres"
	MasterDBName = "postgres"
)

type DatabaseConfig struct {
	Host     string `yaml:"host" required:"true" env:"KOTO_DB_HOST"`
	Port     int    `yaml:"port" default:"5432" env:"KOTO_DB_PORT"`
	SSLMode  string `yaml:"ssl_mode" env:"KOTO_DB_SSL_MODE"`
	DBName   string `yaml:"db_name" required:"true" env:"KOTO_DB_NAME"`
	User     string `yaml:"user" required:"true" env:"KOTO_DB_USER"`
	Password string `yaml:"password" required:"true" env:"KOTO_DB_PASSWORD"`
}

func OpenDatabase(cfg DatabaseConfig, migrations ...func(db *sqlx.DB, dialect string) (n int, err error)) (db *sqlx.DB, migrationsCount int, err error) {
	if cfg.DBName == "" {
		return nil, 0, errors.New("database name should be specified")
	}

	connectionStr := cfg.ConnectionString()

	db, err = sqlx.Connect(dbDialect, connectionStr)
	if err != nil {
		return nil, 0, fmt.Errorf("can't connect to database: %w", err)
	}

	var n int
	for _, migrate := range migrations {
		m, err := migrate(db, dbDialect)
		if err != nil {
			return nil, 0, fmt.Errorf("can't apply migration to the database: %w", err)
		}
		n += m
	}

	db.SetMaxOpenConns(30)
	return db, n, nil
}

func CreateDatabaseIfNotExist(cfg DatabaseConfig) error {
	connectionStr := cfg.ConnectionString()

	db, err := sqlx.Connect(dbDialect, connectionStr)
	if err == nil {
		_ = db.Close()
		return nil
	}

	dbName := cfg.DBName
	cfg.DBName = MasterDBName
	connectionStr = cfg.ConnectionString()

	db, err = sqlx.Connect(dbDialect, connectionStr)
	if err != nil {
		return fmt.Errorf("can't connect to postgres database: %w", err)
	}
	defer func() { _ = db.Close() }()

	_, err = db.Exec(fmt.Sprintf("create database %s;", dbName))
	if err != nil {
		return fmt.Errorf("can't create the database: %w", err)
	}
	return nil
}

func (cfg DatabaseConfig) ConnectionString() string {
	sslMode := cfg.SSLMode
	if sslMode == "" {
		sslMode = "require"
	}

	return fmt.Sprintf(`host='%s' port=%d user='%s' password='%s' sslmode='%s' dbname='%s'`,
		cfg.Host, cfg.Port, cfg.User, cfg.Password, sslMode, cfg.DBName)
}
