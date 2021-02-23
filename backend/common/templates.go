package common

import (
	"embed"
	"html/template"
	"io/fs"
	"path/filepath"

	"github.com/ansel1/merry"
)

func ParseTemplates(templatesDir embed.FS, rootDir string) (*template.Template, error) {
	root := template.New("")
	err := fs.WalkDir(templatesDir, ".", func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() {
			return nil
		}

		data, err := templatesDir.ReadFile(path)
		if err != nil {
			return merry.Prependf(err, "can't read template file %s", path)
		}

		name, _ := filepath.Rel(rootDir, path)
		_, err = root.New(name).Parse(string(data))
		if err != nil {
			return merry.Prependf(err, "can't parse template %s", path)
		}

		return nil
	})
	if err != nil {
		return nil, err
	}
	return root, nil
}
