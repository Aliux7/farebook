
package main

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi/v5"
	"github.com/gorilla/websocket"
    "github.com/gorilla/handlers" 
	"github.com/rs/cors"

	"github.com/Aliux7/WEB-KS-231/database"
	"github.com/Aliux7/WEB-KS-231/directives"
	"github.com/Aliux7/WEB-KS-231/graph"
	"github.com/Aliux7/WEB-KS-231/graph/model"
	"github.com/Aliux7/WEB-KS-231/middlewares"
)

const defaultPort = "8080"

var Conns = make(map[string]*websocket.Conn)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	db := database.GetDB()

	router := chi.NewRouter()

	router.Use(cors.New(cors.Options{
		AllowedHeaders:   []string{"*"},
		AllowedOrigins:   []string{"https://toped.vercel.app", "http://localhost:3000", "http://localhost:8080"},
		AllowOriginFunc:  func(origin string) bool { return true },
		AllowCredentials: true,
		Debug:            true,
	}).Handler, middlewares.AuthMiddleware)

	router.Use(middlewares.AuthMiddleware)

	db.AutoMigrate(&model.User{})
	db.AutoMigrate(&model.Post{})
	db.AutoMigrate(&model.Notification{})
	db.AutoMigrate(&model.Like{})
	db.AutoMigrate(&model.Comment{})
	db.AutoMigrate(&model.Media{})
	db.AutoMigrate(&model.LikeComment{})
	db.AutoMigrate(&model.ReplayComment{})
	db.AutoMigrate(&model.Story{})
	db.AutoMigrate(&model.Group{})
	db.AutoMigrate(&model.GroupMember{})
	db.AutoMigrate(&model.PendingGroupMember{})
	db.AutoMigrate(&model.GroupPost{})
	db.AutoMigrate(&model.Reels{})
	db.AutoMigrate(&model.Friend{})
	db.AutoMigrate(&model.Message{})
	db.AutoMigrate(&model.Chat{})
	db.AutoMigrate(&model.GroupChat{})
	db.AutoMigrate(&model.GroupChatMember{})
	db.AutoMigrate(&model.GroupChatMessage{})
	db.AutoMigrate(&model.GroupFile{})

	c := graph.Config{
		Resolvers: &graph.Resolver{
			DB:    db,
			Conns: Conns,
		},
	}
	c.Directives.Auth = directives.Auth
	srv := handler.NewDefaultServer(
		graph.NewExecutableSchema(c),
	)

	allowedOrigins := handlers.AllowedOrigins([]string{"http://localhost:5173"}) // Replace with your frontend URL
    allowedMethods := handlers.AllowedMethods([]string{"GET", "POST", "OPTIONS"})
    allowedHeaders := handlers.AllowedHeaders([]string{"Content-Type"})

	http.Handle("/", handlers.CORS(allowedOrigins, allowedMethods, allowedHeaders)(playground.Handler("GraphQL playground", "/query")))
	http.Handle("/query", handlers.CORS(allowedOrigins, allowedMethods, allowedHeaders)(srv))

	upgrader := websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}

	http.HandleFunc("/websocket", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Printf("WebSocket upgrade error: %v", err)
			return
		}
		// defer conn.Close()
		fmt.Println("WebSocket connection established")

		identifier, err := generateIdentifier(10)
		if err != nil {
			log.Printf("Error generating identifier: %v", err)
			return
		}
		Conns[identifier] = conn

		for {
			messageType, p, err := conn.ReadMessage()
			if err != nil {
				log.Printf("WebSocket read error: %v", err)
				delete(Conns, identifier)
				return
			}

			for _, conn := range Conns {
				if err := conn.WriteMessage(messageType, p); err != nil {
					log.Printf("WebSocket write error: %v", err)
					delete(Conns, identifier)
					conn.Close()
				}
			}
		}
	})

	log.Printf("Connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func generateIdentifier(length int) (string, error) {
	buffer := make([]byte, length)
	_, err := rand.Read(buffer)
	if err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(buffer), nil
}