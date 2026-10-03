.PHONY: install dev

install:
	npm install

dev:
	@trap 'kill 0' EXIT INT TERM; \
	npm run server & \
	npm run dev & \
	wait
