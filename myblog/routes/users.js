var express = require('express');
var router = express.Router();
var middleware = require('../middleware/index');
function md5(val){//使用md5进行加密
    return require('crypto').createHash('md5').update(val).digest('hex');
}
//用户注册
router.get('/reg',middleware.checkNotLogin,function (req, res,next) {
    res.render('user/reg');
});
//当填写用户注册信息提交时的处理
router.post('/reg', function (req, res,next) {
    console.log('提交注册信息');
    //console.log('转到注册页面');
    var user = req.body;//

    if(user.password != user.repassword){
        req.flash('error','两次输入的密码不一致');
        return res.redirect('/users/reg');
    }
    delete user.repassword; //由于repassword不需要保存，所以可以删除
    user.password = md5(user.password); //对密码进行md5加密
    user.avatar = "https://secure.gravatar.com/avatar/"+md5(user.email)+"?s=80"; //得到用户的头像
    new Model('User')(user).save(function(err,user){
        if(err){
            req.flash('error','注册失败');
            return res.redirect('/users/reg');
        }
        req.flash('success','登录成功');
        req.session.user = user;//用户信息存入 session
        res.redirect('/');//注册成功后返回主页
    });
});
//显示用户登录表单
router.get('/login', function (req, res,next) {
    res.render('user/login');
    console.log('转到登录页面');
});
//当填写用户登录信息提交时的处理
router.post('/login', function (req, res,next) {
    console.log('提交登录信息');
    var user = req.body;
    console.log(user);
    user.password = md5(user.password);
    Model('User').findOne(user,function(err,user){
        if(user){
            console.log(user);
            req.flash('success','登录成功');
            req.session.user = user;//用户信息存入 session
            return res.redirect('/');//注册成功后返回主页
        }
        req.flash('error','登录失败');
        return res.redirect('/users/login');
    });
});
router.get('/logout', function (req, res,next) {
    req.flash('success','注销成功');
    req.session.user = null;//用户信息存入 session
    res.redirect('/');//注册成功后返回主页
});
module.exports = router;
