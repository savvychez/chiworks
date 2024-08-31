.DEFAULT_GOAL := all
SHELL 		  := bash

all:
	(cd front-end && npm run dev) & (cd back-end && python3 app.py) & wait


# Install project dependencies (install python (with pip) & node.js beforehand)
install:
	@echo Installing dependencies...
	cd front-end && \
	npm i
	npm install -g @aws-amplify/cli
	cd back-end && \
	pip install -r requirements.txt

# Check for missing/unused dependencies
depcheck:
	cd front-end && \
	depcheck

# Remove temporary files
clean:
	rm -rf __pycache__
	rm -rf .mypy_cache

# run docker image (use this to run local preview of site)
dockerstart:
	make build
	docker-compose up -d --build
	@sleep 2
	@docker-compose logs

# stop docker image (use to close preview)
dockerstop:
	docker-compose down

# package.json scripts
dev:
	cd front-end && \
	npm run dev

build:
	cd front-end && \
	npm run build

lint:
	cd front-end && \
	npm run lint

preview:
	cd front-end && \
	npm run preview

# show  direct dependencies and their version
versions:
	@echo Kernel: $(shell uname -s)
	@echo Kernel version: $(shell uname -r)
	cd front-end && \
	npm list --depth=0

# get git config
config:
	git config -l

# get git log
gitlog.txt:
	git log > gitlog.txt

# get git status
status:
	make clean
	git branch
	git remote -v
	git status
