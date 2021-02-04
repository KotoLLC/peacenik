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
	"github.com/mreider/koto/backend/userhub/caches"
	"github.com/mreider/koto/backend/userhub/repo"
	"github.com/mreider/koto/backend/userhub/services"
)

var (
	transparentPixel = []byte("\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\x00\x00\x00\x21\xF9\x04\x01\x00\x00\x00\x00\x2C\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3B")
)

func Image(repos repo.Repos, userCache caches.Users, s3Storage *common.S3Storage, staticFS http.FileSystem) http.Handler {
	h := &imageRouter{
		repos:     repos,
		userCache: userCache,
		s3Storage: s3Storage,
		staticFS:  staticFS,
	}
	r := chi.NewRouter()
	r.Get("/avatar/{userID}", h.UserAvatar)
	r.Get("/user/background/{userID}", h.UserBackground)
	r.Get("/user/{userID}", h.UserAvatar)
	r.Get("/group/background/{groupID}", h.GroupBackground)
	r.Get("/group/{groupID}", h.GroupAvatar)
	return r
}

type imageRouter struct {
	repos     repo.Repos
	userCache caches.Users
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

	me := r.Context().Value(services.ContextUserKey).(repo.User)
	userInfo := ir.userCache.User(userID, me.ID)

	if userInfo.AvatarThumbnailID == "" || (me.ID != userID && !ir.repos.Friend.AreFriends(me.ID, userID)) {
		ir.loadNoAvatarImage()
		w.Header().Set("Cache-Control", "max-age=60")
		http.ServeContent(w, r, "no-avatar.png", ir.noAvatarModTime, bytes.NewReader(ir.noAvatarImage))
		return
	}
	link, err := ir.s3Storage.CreateLink(r.Context(), userInfo.AvatarThumbnailID, time.Hour*24)
	if err != nil {
		log.Println("can't create s3 link: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "")
	w.Header().Set("Cache-Control", "max-age=60")
	http.Redirect(w, r, link, http.StatusMovedPermanently)
}

func (ir *imageRouter) UserBackground(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "userID")
	if userID == "" {
		http.NotFound(w, r)
		return
	}

	me := r.Context().Value(services.ContextUserKey).(repo.User)
	userInfo := ir.userCache.User(userID, me.ID)

	if userInfo.BackroundID == "" || (me.ID != userID && !ir.repos.Friend.AreFriends(me.ID, userID)) {
		w.Header().Set("Content-Type", "image/gif")
		w.Header().Set("Cache-Control", "max-age=60")
		_, _ = w.Write(transparentPixel)
		return
	}
	link, err := ir.s3Storage.CreateLink(r.Context(), userInfo.BackroundID, time.Hour*24)
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

	group := ir.repos.Group.FindGroupByID(groupID)
	if group == nil || group.AvatarThumbnailID == "" {
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

func (ir *imageRouter) GroupBackground(w http.ResponseWriter, r *http.Request) {
	groupID := chi.URLParam(r, "groupID")
	if groupID == "" {
		http.NotFound(w, r)
		return
	}

	group := ir.repos.Group.FindGroupByID(groupID)
	if group == nil || group.BackgroundID == "" {
		w.Header().Set("Content-Type", "image/gif")
		w.Header().Set("Cache-Control", "max-age=60")
		_, _ = w.Write(transparentPixel)
		return
	}
	link, err := ir.s3Storage.CreateLink(r.Context(), group.BackgroundID, time.Hour*24)
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
