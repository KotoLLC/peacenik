# this script is just for testing purposes

trap "exit" INT TERM ERR
trap "kill 0" EXIT

cd backend
openssl genrsa -out central.rsa 1024
go build -o central-service ./central/cmd/
./central-service -address ":12001" -db central.db -key central.rsa -admin matt@mail.com &
go build -o node-service ./node/cmd/
./node-service -address ":12002" -external "http://localhost:12002" -db node12002.db -central "http://localhost:12001" &
cd ..
cd frontend
npm install
npm run start &

wait