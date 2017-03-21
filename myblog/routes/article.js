var express = require('express');
var router = express.Router();
var markdown = require('markdown').markdown;
var middleware = require('../middleware/index');
var async=require("async");

//打开添加文章的页面
router.get('/add',middleware.checkLogin, function(req, res, next) {
    console.log("打开添加文章页面");
    res.render("article/add",{title:"发表文章"});

});

router.post("/add",middleware.checkLogin,function (req,res,next) {
    console.log("提交新博客的信息");
    var article = req.body;
    article.user = req.session.user._id;
    new Model('Article')(article).save(function (err,art) {
        if(err)
        {
            console.log(err);
            //发表文章失败,转到发表页面
            return res.redirect("/article/add");
        }
        //发表成功后转到首页
        return res.redirect("/")

    })

});
router.post("/edit/:_id",middleware.checkLogin,function (req,res,next) {
    console.log("修改博客的信息");
    var article = req.body;

    Model('Article').update({_id:req.params._id},
        article,
        function (err,art) {
            if(err)
            {
                console.log(err);
                req.flash("error","修改失败");
            }
            console.log(art);
            //发表文章失败,转到发表页面
            console.log("更新成功");
            req.flash("success","修改成功");
            return res.redirect("/articles/detail/"+req.params._id);
        })
});

router.get("/detail/:_id",function (req,res,next) {
    //路径参数中如果参数是id,那么名字必须是_id
    /*var articleId= req.params._id;
     Model('Article').findOne({_id:articleId},function (err,article) {
     article.content = markdown.toHTML(article.content);
     res.render('article/detail',{title:'查看文章',art:article});
     })*/
    async.parallel([function(callback){
        Model('Article').findOne({_id:req.params._id}).populate('user').populate('comments.user').exec(function(err,article){
            article.content = markdown.toHTML(article.content);
            callback(err,article);
        });
    },function(callback){
        Model('Article').update({_id:req.params._id},{$inc:{pv:1}},callback);
    }],function(err,result){
        if(err){
            req.flash('error',err);
            res.redirect('back');
        }
        res.render('article/detail',{title:'查看文章',article:result[0]});
    });
})

router.get("/edit/:_id",function (req,res,next) {
    //路径参数中如果参数是id,那么名字必须是_id
    var articleId= req.params._id;
    Model('Article').findOne({_id:articleId},function (err,article) {
        //添加权限判断,判断当前的登陆人和文章发表人是否一致
        //如果不一致转回详情页面,并显示错误信息
        if(req.session.user && req.session.user._id!= article.user)
        {
            req.flash("error","您没有权限修改此文章");
            return res.redirect("/article/detail/"+article._id);
        }
        console.log("_id="+articleId);
        console.log(article);
        res.render('article/editArticle',{title:'查看文章',art:article});
    })

})

router.get("/delete/:_id",function (req,res,next) {
    //路径参数中如果参数是id,那么名字必须是_id
    var articleId= req.params._id;
    Model('Article').remove({_id:articleId},function (err,art) {

        console.log(art)
        if(err)
        {
            req.flash("error","删除失败");
        }
        req.flash("success","删除成功");
        res.redirect("/");
    })
})

router.all('/list/:pageNum/:pageSize',function(req, res, next) {
    //pageNum 表示当前是第几页，默认值是第一页
    var searchBtn = req.body.searchBtn;
    var pageNum = parseInt(req.params.pageNum)&&parseInt(req.params.pageNum)>0?
        parseInt(req.params.pageNum):1;
    //pageSize 每一夜有多少条记录，默认是2条
    var pageSize =parseInt(req.params.pageSize)&&parseInt(req.params.pageSize)>0?
        parseInt(req.params.pageSize):6;

    //搜索条件对象
    var query = {};
    //只有是点了搜索按钮时，才能获得keyword
    var keyword = req.body.keyword;

   /* var keyword = req.query.keyword;*/
    if(searchBtn){
        //是点击了searchBtn按钮
        //把关键字存到session中防止丢失
        req.session.keyword = keyword;
    }
    if(req.session.keyword){
        query['title'] = new RegExp(req.session.keyword,"ig");
    }
//首先要知道这个搜索结果一共有几条记录，方便计算页数
    Model('Article').count(query,function(err,count){
        console.log("count="+count+"pageCount="+count/pageSize+1);
        //查询符合条件的当前这一页的数据
        Model('Article').find(query)
            .sort({'createTime':-1})
            .skip((pageNum-1)*pageSize)//要查询第n页的数据就要跳过n-1页的数据
            .limit(pageSize)
            .populate('user')
            .exec(function(err,articles){
            articles.forEach(function (article) {
                article.content = markdown.toHTML(article.content);
            });
            res.render('index',{
                title:'主页',
                pageNum:pageNum,
                pageSize:pageSize,
                keyword:req.session.keyword?req.session.keyword:'',
                articles:articles,
                count:count
            });
        });
    });
});
/*评论*/
router.post('/comment',middleware.checkLogin, function (req, res) {
    var user = req.session.user;
    Model('Article').update({_id:req.body._id},{$push:{comments:{user:user._id,content:req.body.content}}},function(err,result){
        if(err){
            req.flash('error',err);
            return res.redirect('back');
        }
        req.flash('success', '评论成功!');
        res.redirect('back');
    });

});

module.exports = router;
