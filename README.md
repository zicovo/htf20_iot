# HTF2020 IoT Server
## Clone & install
To clone the repository, use the following command
```javascript
git clone https://github.com/nicolasgoris/htf20_iot.git
```
To install the necessary packages, use the following command
```javascript
npm i
```
## Configuration & adapting code
### Configuration
You will need to change the configuration to be compliant with your IoT setup.  
Please check the file [config.js](./config/config.js) file and update the configurations.  
Don't forget to update the [certificates and secret](../config) folder.
### Code
You will need to change the code, this will be done in the [api.js](./routes/api.js) file.  
Do not change code in other files unless you know what you are doing :)
## Test
To test if your certificate and secret are okay, execute the test script with following command
```javascript
npm test
```
## Run and use
To run the server, use the following command
```javascript
npm start
```
It will create a server running on your localhost with port 3001.  
Accessing the API will be possible using the link: http://localhost:3001/api/.