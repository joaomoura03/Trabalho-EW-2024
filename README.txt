Como correr o site:

Num terminal fazer:
1- sudo docker-compose down
2- sudo systemctl restart docker
3- sudo python3 setup-container.py UCS datasets/ucs.json datasets/users.json
4- sudo docker exec -it trabalho-ew-2024_mongodb_1 bash

Abrir outro terminal e fazer:
1- npm i
2- npm i mongoose
3- npm start