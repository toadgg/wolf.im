angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $rootScope, $location) {
      $scope.user = {};
      $scope.user.username = "";
      $scope.singin = function () {
        console.log($scope.user.username);
        $rootScope.user = $scope.user;
        console.log($rootScope.user.username);
        $location.path('/tab/chats')
      }
    })

.controller('ChatsCtrl', function($scope, $rootScope, $cordovaImagePicker, $cordovaFile,$cordovaMedia, $ionicLoading, Chats) {
      if (!$rootScope.user) {
        $rootScope.user = {};
        $rootScope.user.username = 'Guest';
      }
      $scope.title = "Chats(" + $rootScope.user.username + ")";
  console.log($rootScope.user.username + " join!");
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
      var mqttClient = null,
          //nickname = 'test' + Math.floor((Math.random()*10)),
          nickname = $rootScope.user.username,
          currentRoom = null,
          serverAddress = 'localhost';
      //serverDisplayName = 'MQTT Chat Server',
      //serverDisplayColor = '#1c5380',

      //mqttClient = new Messaging.Client(serverAddress, 1884,'1');
      //mqttClient.connect({onSuccess:onConnect, cleanSession:false});
      //mqttClient.onMessageArrived = onMessageArrived;


      // creating the connection and saving the socket
      mqttClient = new Messaging.Client(serverAddress, 1884,nickname);
      mqttClient.connect({onSuccess:onConnect, cleanSession:false});
      mqttClient.onMessageArrived = onMessageArrived;

      function onConnect() {
        currentRoom = 'Lobby';
        mqttClient.subscribe(currentRoom, {qos:1});
        mqttClient.subscribe('addroom');
        mqttClient.subscribe('removeroom');
        mqttClient.subscribe('totalrooms');
        mqttClient.subscribe('totalclients');
        mqttClient.subscribe('online');
        mqttClient.subscribe('offline');
      };

      function onMessageArrived(message) {
        var msg = JSON.parse(message.payloadString);
        var topic = message.destinationName;
        if(topic == 'addroom') {
          if(msg.nickname != nickname) {
            //insertMessage(serverDisplayName, 'The room `' + msg.room + '` created...', true, false, true);
          }
        } else if(topic == 'removeroom') {
          //removeRoom(msg.room, false);
        } else if(topic == 'totalrooms') {
          for(var i = 0, len = msg.length; i < len; i++){
            if(msg[i]._id && msg[i]._id != ''){
              //addRoom(msg[i]._id, false);
            }
          }

        } else if(topic == 'online') {
          if(msg.nickname != nickname && msg.room == currentRoom) {
            // show a message about this client
            //insertMessage(serverDisplayName, msg.nickname + ' has joined the room...', true, false, true);

          }
        } else if(topic == 'offline') {
          if(msg.nickname != nickname && msg.room == currentRoom) {
            // if announce is true, show a message about this room
            //insertMessage(serverDisplayName, msg.nickname + ' has left the room...', true, false, true);
            //removeClient(msg.nickname, false);
          }
        }else if(topic == 'totalclients') {
          if(msg._id == currentRoom) {

            for(var i = 0, len = msg.clientIds.length; i < len; i++){
              if(msg.clientIds[i]&& msg.clientIds[i] != nickname){
                //removeClient(msg.clientIds[i], false);
              }
            }

            for(var i = 0, len = msg.clientIds.length; i < len; i++){
              if(msg.clientIds[i] && msg.clientIds[i] != nickname){
                //addClient({nickname: msg.clientIds[i], clientId: msg.clientIds[i]}, false);
              }
            }
          }
        } else {
          // send the message to the server with the room name
          if(msg.type === 'image') {
              console.log('topic is : ' + topic);
              console.log(message);

              var chat = {
                  id: msg.nickname,
                  name: msg.nickname,
                  lastText: "<img src='" + msg.message + "'/>",
                  face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
              };
              $scope.chats.push(chat);
              $scope.$apply();
              //alert(msg.message);
            //insertImage(msg.nickname, msg.message,true,  msg.nickname == nickname, false);
          } else {
            console.log('topic is : ' + topic);
            console.log(message);
            var chat = {
              id: msg.nickname,
              name: msg.nickname,
              lastText: msg.message,
              face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
            };
            $scope.chats.push(chat);
            $scope.$apply();
            //insertMessage(msg.nickname, msg.message,true,  msg.nickname == nickname, false);
          }

        }

      }

  //if (typeof dcodeIO === 'undefined' || !dcodeIO.ProtoBuf) {
  //  throw(new Error("ProtoBuf.js is not present. Please see www/index.html for manual setup instructions."));
  //}
   //Initialize ProtoBuf.js
  //var ProtoBuf = dcodeIO.ProtoBuf;
  //var Message = ProtoBuf.loadProtoFile("./example.proto").build("Message");
  //socket.on('connect', function () {
  //  console.log('socket connect');
  //  socket.on('mqtt', function (msg) {
  //    console.log('socket on mqtt');
  //    console.log(msg.payload);
  //    var protoMsg = Message.decode(msg.payload);
  //    console.log(protoMsg);
  //    var chat = {
  //      id: Math.random(),
  //      name: protoMsg.text,
  //      lastText: protoMsg.text2,
  //      face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  //    };
  //    $scope.chats.push(chat);
  //  });
  //  var msg = new Message('欢迎', '欢迎使用wolf.im');
  //  socket.emit('subscribe',{topic:'/sensor/OTGW/connect'});
  //});
      $scope.message = "";
      $scope.send = function () {
        var msg = new Messaging.Message(JSON.stringify({nickname: nickname, message: $scope.message}));
        msg.destinationName = currentRoom;
          msg.qos = 1;
          //msg.retained = true;

        mqttClient.send(msg);
        //var msg = new Message($scope.message, $scope.message);
        //socket.emit('subscribe',{topic:'/sensor/OTGW/message', msg: msg.encode64()});
      };
        //$scope.imgSrc = "";
        $scope.pickImage = function () {
            //console.log("haha");
            var options = {
                maximumImagesCount: 1,
                width: 800,
                height: 800,
                quality: 80
            };
            $cordovaImagePicker.getPictures(options)
                .then(function (results) {
                    console.log(results);
                    //$scope.imgSrc = results[0];
                    var filepath = results[0];
                    var strs = filepath.split("/");
                    var fileName = strs[strs.length-1];
                    $cordovaFile.readAsDataURL(cordova.file.tempDirectory, fileName)
                        .then(function (success) {
                            var msg = new Messaging.Message(JSON.stringify({nickname: nickname, message: success, type: 'image'}));
                            msg.destinationName = currentRoom;
                            msg.qos = 1;
                            mqttClient.send(msg);
                        }, function (error) {
                            alert("error"+error);
                            console.log(error);
                        });
                }, function (error) {
                    // error getting photos
                    alert('error');
                });
        };
        $scope.record = function () {
            //var src = "/src/myrecording.mp3";
            //var media = $cordovaMedia.newMedia(src).then(function() {
            //    // success
            //}, function () {
            //    // error
            //});
console.log("record.....");
            //var src = "myrecording.mp3";
            //var src = "http://www.stephaniequinn.com/Music/Vivaldi%20-%20Spring%20from%20Four%20Seasons.mp3";
            //var mediaRec = $cordovaMedia.newMedia(src).then(
            //    function() {
            //        console.log("recordAudio():Audio Success");
            //        // Record audio
            //        //mediaRec.startRecord();
            //        //
            //        //// Stop recording after 10 seconds
            //        //setTimeout(function() {
            //        //    mediaRec.stopRecord();
            //        //}, 10000);
            //        //mediaRec.play();
            //
            //        var iOSPlayOptions = {
            //            numberOfLoops: 2,
            //            playAudioWhenScreenIsLocked : false
            //        };
            //
            //        mediaRec.play(iOSPlayOptions); // iOS only!
            //    },
            //    function (err) {
            //        console.log("recordAudio():Audio Error: "+ err.code);
            //        console.log("recordAudio():Audio Error: "+ err.message);
            //    }
            //);

            var media = new Media(src, null, null, mediaStatusCallback);
            $cordovaMedia.play(media);
            //media.play(); // Android

        }
        var mediaStatusCallback = function(status) {
            if(status == 1) {
                $ionicLoading.show({template: 'Loading...'});
            } else {
                $ionicLoading.hide();
            }
        }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
