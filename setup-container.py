import subprocess
import os
import sys

def generate_docker_compose(db_name, ucs_json_path, users_json_path):
    ucs_json_path = os.path.abspath(ucs_json_path)
    users_json_path = os.path.abspath(users_json_path)
    
    docker_compose_template = f"""
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    depends_on:
      - mongo-seed-ucs
      - mongo-seed-users
  mongo-seed-ucs:
    image: mongo:latest
    volumes:
      - {ucs_json_path}:/datasets/ucs.json
    command: mongoimport --host mongodb -d {db_name} -c ucs --type json --file /datasets/ucs.json --jsonArray
  mongo-seed-users:
    image: mongo:latest
    volumes:
      - {users_json_path}:/datasets/users.json
    command: mongoimport --host mongodb -d {db_name} -c users --type json --file /datasets/users.json --jsonArray
"""
    with open("docker-compose.yml", "w") as f:
        f.write(docker_compose_template)

def start_container():
    subprocess.run(["docker-compose", "up", "-d"])

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python setup-container.py <db_name> <ucs_json_path> <users_json_path>")
        sys.exit(1)

    db_name = sys.argv[1]
    ucs_json_path = sys.argv[2]
    users_json_path = sys.argv[3]
    
    generate_docker_compose(db_name, ucs_json_path, users_json_path)
    start_container()
