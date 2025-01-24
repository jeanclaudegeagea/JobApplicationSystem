.phony: client server

client:
	cd ./frontend && npm run dev

server:
	cd ./backend && npm start

killPort:
	npx kill-port 5173 && npx kill-port 5000