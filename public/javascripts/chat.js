$(function() {
    var socket = io.connect('http://limitless-sea-5666.herokuapp.com/');
	socket.on('connect', function() {
		console.log('connected');
	});
	
	$('#btn').click(function() {
		var message = $('#message');
		console.log(message.val());
		//サーバーにメッセージを引数にイベントを実行する
		socket.emit('msg send', message.val());
	});

	//サーバーが受け取ったメッセージを返して実行する
	socket.on('msg push', function (msg) {
		console.log(msg);
		var date = new Date();
		$('#list').prepend($('<dt>' + date + '</dt><dd>' + msg + '</dd>'));
	});
	
	socket.on('msg updateDB', function(msg){
		console.log(msg);
	});
});
