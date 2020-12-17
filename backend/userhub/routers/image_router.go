package routers

import (
	"bytes"
	"io/ioutil"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/go-chi/chi"

	"github.com/mreider/koto/backend/common"
	"github.com/mreider/koto/backend/userhub/repo"
)

func Image(repos repo.Repos, s3Storage *common.S3Storage, staticFS http.FileSystem) http.Handler {
	h := &imageRouter{
		repos:     repos,
		s3Storage: s3Storage,
		staticFS:  staticFS,
	}
	r := chi.NewRouter()
	r.Get("/avatar/{userID}", h.UserAvatar)
	r.Get("/group/{groupID}", h.GroupAvatar)
	return r
}

type imageRouter struct {
	repos     repo.Repos
	s3Storage *common.S3Storage
	staticFS  http.FileSystem

	noAvatarOnce    sync.Once
	noAvatarImage   []byte
	noAvatarModTime time.Time
}

func (ir *imageRouter) UserAvatar(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "userID")
	if userID == "" {
		http.NotFound(w, r)
		return
	}

	user, err := ir.repos.User.FindUserByID(userID)
	if err != nil {
		log.Println("can't find user: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if user == nil {
		http.NotFound(w, r)
		return
	}

	if user.AvatarThumbnailID == "" {
		ir.loadNoAvatarImage()
		w.Header().Set("Cache-Control", "max-age=60")
		http.ServeContent(w, r, "no-avatar.png", ir.noAvatarModTime, bytes.NewReader(ir.noAvatarImage))
		return
	}
	link, err := ir.s3Storage.CreateLink(r.Context(), user.AvatarThumbnailID, time.Hour*24)
	if err != nil {
		log.Println("can't create s3 link: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "")
	w.Header().Set("Cache-Control", "max-age=60")
	http.Redirect(w, r, link, http.StatusMovedPermanently)
}

func (ir *imageRouter) GroupAvatar(w http.ResponseWriter, r *http.Request) {
	groupID := chi.URLParam(r, "groupID")
	if groupID == "" {
		http.NotFound(w, r)
		return
	}

	group, err := ir.repos.Group.FindGroupByID(groupID)
	if err != nil {
		log.Println("can't find group: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if group == nil {
		http.NotFound(w, r)
		return
	}

	if group.AvatarThumbnailID == "" {
		ir.loadNoAvatarImage()
		w.Header().Set("Cache-Control", "max-age=60")
		http.ServeContent(w, r, "no-avatar.png", ir.noAvatarModTime, bytes.NewReader(ir.noAvatarImage))
		return
	}
	link, err := ir.s3Storage.CreateLink(r.Context(), group.AvatarThumbnailID, time.Hour*24)
	if err != nil {
		log.Println("can't create s3 link: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "")
	w.Header().Set("Cache-Control", "max-age=60")
	http.Redirect(w, r, link, http.StatusMovedPermanently)
}

func (ir *imageRouter) loadNoAvatarImage() {
	ir.noAvatarOnce.Do(func() {
		f, err := ir.staticFS.Open("/no-avatar.png")
		if err != nil {
			log.Println("can't open no-avatar.png:", err)
			return
		}
		defer func() { _ = f.Close() }()
		content, err := ioutil.ReadAll(f)
		if err != nil {
			log.Println("can't read no-avatar.png:", err)
			return
		}
		ir.noAvatarImage = content

		stat, err := f.Stat()
		if err != nil {
			log.Println("can't get stat for no-avatar.png:", err)
			return
		}
		ir.noAvatarModTime = stat.ModTime()
	})
}
