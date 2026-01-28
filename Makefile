.PHONY: dcfb dcbu dcbd dcfu dcfd dcau dcad dcfp

help:
	@echo 'Usage: make <target>'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

dcfb:
	docker-compose --profile frontend build

dcbu:
	docker-compose --profile backend up -d

dcbd:
	docker-compose --profile backend down

dcfu:
	docker-compose --profile frontend up -d

dcfd:
	docker-compose --profile frontend down

dcau:
	docker-compose --profile all up -d

dcad:
	docker-compose --profile all down

dcfp:
	docker-compose --profile frontend push