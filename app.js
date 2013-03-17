
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = module.exports = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('view options', {layout: false, pretty: true});
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser('secret', 'lorem ipsum'));
  app.use(express.session({
    key: 'sess_id'
  }));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.locals({
  title: 'expressハンズオン！'
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/form', routes.form);
app.post('/create', routes.create);

var about_handler = require('./routes/about');
app.get('/about/:id?.:format?', about_handler.index);
app.set('some_value', '1'); //設定
console.log(app.set('some_value')); //取得

/*
var fs = require('fs')
  , path = require('path')
  , routes_dir = path.resolve(__dirname + '/routes');
var map_routes = function(dir) {
  var files = fs.readdirSync(dir);
  files.forEach(function(e){
    e = dir + '/' + e;
    var stats = fs.statSync(e);
    if(stats.isDirectory()){
      map_routes(e);
    }
    else{
      var url_path = '/';
      if(path.basename(e, '.js') == 'index'){
        url_path += path.dirname(path.relative(routes_dir, e));
      }
      else{
        url_path += path.relative(routes_dir, e).replace('.js', '');
      }
      url_path = path.normalize(url_path);
      var handler = require(e);
      for(var f in handler){
        switch(f){
          case 'index':
            app.get(url_path + '?', handler[f]);
            break;
          case 'new':
            app.get(url_path + '/new', handler[f]);
            break;
          case 'create':
            app.post(url_path, handler[f]);
            break;
          case 'edit':
            app.get(url_path + '/:id/edit', handler[f]);
            break;
          case 'update':
            app.put(url_path + '/:id', handler[f]);
            break;
          case 'destroy':
            app.del(url_path + '/:id', handler[f]);
            break;
          case 'show':
            app.get(url_path + '/:id.:format?', handler[f]);
            break;
          default:
            app.get(url_path + '/' + f, handler[f]);
        }
      }
    }
  });
};
map_routes(routes_dir);
*/

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
