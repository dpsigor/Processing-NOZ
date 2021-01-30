docker run -p 5432:5432 --name nozdb postgres
docker run -p 3457:80 --name noz_pgadmin -e PGADMIN_DEFAULT_EMAIL="admin@admin.com" -e PGADMIN_DEFAULT_PASSWORD="password" dpage/pgadmin4