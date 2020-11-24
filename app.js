const express = require('express'),
  http = require('http'),
  routes = require('./routes/api'),
  app = express();

app.set('port', process.env.PORT || 3001);
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});
app.use(express.json())
app.use('/public', express.static('public'));
app.use('/', routes);

const server = http.createServer(app);
server.listen(app.get('port'), () => console.log(`listening on ${app.get('port')}`));