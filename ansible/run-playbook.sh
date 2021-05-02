docker build -t ansible .
docker run -it -v "$PWD":/ansible ansible ansible-playbook $1