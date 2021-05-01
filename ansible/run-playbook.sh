docker build -t ansible .
docker run -it -v "$PWD":/ansible -v "$PWD/known_hosts":/root/.ssh/known_hosts ansible ansible-playbook $1