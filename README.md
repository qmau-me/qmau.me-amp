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
## Run this project 
1. Clone this project
```bash
git clone git@github.com:qmau-me/qmau.me-amp.git
```
2. Update admin account 
```bash
mkdir updates
vi 0.0.1-admins.js
```
`0.0.1-admins.js`
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

`.env`
```
COOKIE_SECRET= [YOUR_SECRET_CODE]
PORT = [PORT] #default port is 3000
```

4. Run and enjoy
```bash
node keystone.js
```

# License
qmau.me-amp is licensed under the Apache License, Version 2.0.
