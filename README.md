# qmau.me-amp ⚡
AMP version of qmau.me

Site: https://qmau.me

Responsive design blog using [Google AMP](https://www.ampproject.org/) (Accelerated Mobile Pages) to speed up page load-time for mobile users.

# In case you want to run or customize this project
## Install node.js and mongodb
1. `Node.js` v8.x
```shell
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential
```

2. `Mongodb` v3.6
```shell
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

3. `Nginx`
```shell
sudo apt-get update
sudo apt-get install nginx

sudo ufw allow 'Nginx Full'
```

4. `pm2` (OPTIONAL for Node.js monitoring and process management)
```shell
npm install pm2 -g
```
_[gist](https://gist.github.com/qmau94/de4ffbad56925f21e9224dc03e70c639) for ubuntu16.04_
## Run this project
1. Clone this project
```bash
git clone git@github.com:qmau-me/qmau.me-amp.git
```
2. Update admin account
```bash
vi updates/0.0.1-admins.js
```
```js
exports.create = {
	User: [
		{ 'name.first': 'Admin', 'name.last': 'User', 'email': [YOUR_EMAIL], 'password': [YOUR_PASSWORD], 'isAdmin': true },
	],
};
```
3. Create .env file
```bash
vi .env
```
```
COOKIE_SECRET= [YOUR_SECRET_CODE]
PORT = [PORT] #default port is 3000
```

4. Start keystone.js
```bash
node keystone.js
#pm2
pm2 start keystone.js
```

5. Deploy
```
vi /etc/nginx/conf.d/blog.conf
```
`blog.conf`
```
server {
    server_name [DOMAIN] default_ server;
    listen 80;

    access_log /var/log/nginx/blog-access.log;
    error_log /var/log/nginx/blog-error.log;

    location / {
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   Host      $http_host;
        proxy_pass         http://127.0.0.1:3000; #default port is 3000
    }

}
```

6. Restart and enjoy
```shell
sudo service nginx restart
```

# License
qmau.me-amp is licensed under the Apache License, Version 2.0.

