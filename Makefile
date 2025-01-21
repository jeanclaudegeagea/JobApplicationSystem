.phony: client server

client:
	cd ./frontend && npm run dev

server:
	cd ./backend && npm start