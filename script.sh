
echo "setting up db";

psql -U postgres -h localhost -c "CREATE DATABASE notebook_api;"

psql -U postgres -h localhost -d notebook_api -f database/migrations/schema.sql

echo "db set up";