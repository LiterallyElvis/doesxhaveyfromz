package main

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/lib/pq"
)

func connectToDB() {
	db, err := sql.Open("postgres", os.Getenv("POSTGRES_CONNECTION_URL"))
	if err != nil {
		log.Fatal(err)
	}

	age := 21
	rows, err := db.Query("SELECT name FROM users WHERE age = $1", age)
}
