package main

import (
	"bytes"
	"context"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
)

func main() {
	var port int
	flag.IntVar(&port, "port", 5000, "http port")
	flag.Parse()

	apiEndpoint := os.Getenv("KOTO_CENTRAL_HOST")
	if apiEndpoint == "" {
		apiEndpoint = "http://localhost:12001"
	}

	rootDir, err := filepath.Abs("build")
	if err != nil {
		log.Fatalln(err)
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	r := chi.NewRouter()
	setupMiddlewares(r)
	serveFrontendFiles(r, "/static/", filepath.Join(rootDir, "static"))
	r.Get("/*", serveIndex(filepath.Join(rootDir, "index.html"), strings.TrimSuffix(apiEndpoint, "/")))

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT)
	signal.Notify(stop, syscall.SIGTERM)

	httpServer := &http.Server{
		Addr:    fmt.Sprintf(":%d", port),
		Handler: r,
	}

	go func() {
		log.Printf("started on :%d, serving %s\n", port, rootDir)
		if err := httpServer.ListenAndServe(); err != http.ErrServerClosed {
			log.Fatalln(err)
		}
	}()

	<-stop
	log.Println("Shutting down the server...")

	ctxShutdown, cancelShutdown := context.WithTimeout(ctx, 10*time.Second)
	defer cancelShutdown()

	err = httpServer.Shutdown(ctxShutdown)
	if err != nil {
		log.Println("can't shutdown:", err)
	}

	cancel()

	log.Println("Shut down")
}

func setupMiddlewares(r *chi.Mux) {
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
}

func serveFrontendFiles(r chi.Router, path string, rootDir string) {
	root := http.Dir(rootDir)
	fs := http.StripPrefix(path, http.FileServer(root))

	r.Get(path+"*", func(w http.ResponseWriter, r *http.Request) {
		fs.ServeHTTP(w, r)
	})
}

func serveIndex(indexPath, apiEndpoint string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		disableResponseCaching(w)

		data, err := ioutil.ReadFile(indexPath)
		if err != nil {
			panic(err)
		}

		data = bytes.Replace(data, []byte(`window.apiEndpoint="http://localhost:12001"`), []byte(fmt.Sprintf(`window.apiEndpoint="%s"`, apiEndpoint)), 1)
		_, _ = w.Write(data)
	}
}

func disableResponseCaching(w http.ResponseWriter) {
	w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
	w.Header().Set("Pragma", "no-cache")
	w.Header().Set("Expires", "0")
}
