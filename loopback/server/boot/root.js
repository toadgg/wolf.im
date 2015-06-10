module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  server.use(router);
  router.get('/test', function(req, res){
    var User = server.loopback.User;
    User.find({
      where: {username: "test"}
    }, function(err, user) {
      console.log(user);
    });

    res.send('hello world');
  });
};
