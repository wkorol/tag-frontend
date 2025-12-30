up:
	docker compose up --build

shell:
	docker compose run --service-ports --rm web bash
