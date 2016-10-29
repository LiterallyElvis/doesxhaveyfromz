package main

import (
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

// var db *bolt.DB
var db *redis.Client
var primaryBucketName = []byte{'t', 'a', 's', 'k', 's'}

func init() {
	db = connectToRedis()
}

func homepage(w http.ResponseWriter, r *http.Request) {
	indexPage, err := ioutil.ReadFile("views/index.html")
	if err != nil {
		log.Printf("error occurred reading indexPage: %v\n", err)
	}
	w.Write(indexPage)
}

func fourOhFour(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("whoops!"))
}

func main() {

	router := mux.NewRouter()
	router.NotFoundHandler = http.HandlerFunc(fourOhFour)

	router.HandleFunc("/", homepage).Methods("GET")

	http.Handle("/", authChecker(router))
	http.ListenAndServe(":8080", nil)
}
