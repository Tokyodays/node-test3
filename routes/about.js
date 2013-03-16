

var app = module.parent.exports;

exports.index = function(req, res){
    console.log(req.params.id);
    console.log(req.params.format);
    req.session.message = 'セッションに保存したいメッセージ';
    res.render('about', {title: app.locals.title});
};