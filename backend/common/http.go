package common

import (
	"encoding/json"
	"net/http"
)

func ReadJSONFromRequest(w http.ResponseWriter, r *http.Request, target interface{}) bool {
	err := json.NewDecoder(r.Body).Decode(target)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return false
	}
	return true
}

func WriteJSONToResponse(w http.ResponseWriter, source interface{}) {
	w.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(w).Encode(source)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
