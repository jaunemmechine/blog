### 运行执行的命令
#### (1)在安装的mogodb下的bin 目录下执行 mongod --dbpath data文件所在的路径
#### (2)在bin的目录下新的窗口输入 mongo 的命令
#### (3)输入 use myblog
#### (4)运行www.js 文件


# blog
### 本项目采用express+npm+ejs+mongodb+mongoose来搭建项目
## Express安装
#### 首先安装淘宝镜像
```
 npm install -g cnpm --registry=https://registry.npm.taobao.org
 ```
#### 接着
```
$ cnpm install -g express-generator
```
#### 安装 express 命令行工具，使用它我们可以初始化一个 express 项目
### 生成一个项目
#### 在命令行中输入
```
$ express -e myblog
$ cd myblog && cnpm install
```
#### 执行结果中会显示生成的文件并提示后续的命令
#### 设置环境变量并启动服务器,在命令行中执行下列命令
```
SET DEBUG=myblog:* & npm start
```
#### 执行完成后会显示
```
  myblog:server Listening on port 3000 +0ms
  ```
#### 在浏览器里访问 http://localhost:3000 就可以显示欢迎页面
```
Express
Welcome to Express
```
#### 刚才我们就用express生成器生成了一个使用ejs模板的示例工程。
## 生成文件的说明
#### app.js：express的主配置文件
#### package.json：存储着工程的信息及模块依赖，当在 dependencies 中添加依赖的模块时，运行 npm install，npm 会检查当前目录下的 package.json，并自动安装所有指定的模块
#### node_modules：存放 package.json 中安装的模块，当你在 package.json 添加依赖的模块并安装后，存放在这个文件夹下
#### public：存放 image、css、js 等文件
#### routes：存放路由文件
#### views：存放视图文件或者说模版文件
#### bin：可执行文件，可以从此启动服务器

### app.js
```
var express = require('express'); //加载node_modules下的express模块
    var path = require('path');
    var favicon = require('serve-favicon');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');

    var routes = require('./routes/index');
    var users = require('./routes/users');

    var app = express(); //生成一个express实例 app

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));//设置 views 文件夹为存放视图文件的目录, 即存放模板文件的地方,__dirname 为全局变量,存储当前正在执行的脚本所在的目录。
    app.set('view engine', 'ejs'); //设置视图模板引擎为 ejs。

    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));// 设置/public/favicon.ico为favicon图标。
    app.use(logger('dev'));// 加载日志中间件。
    app.use(bodyParser.json()); //加载解析json的中间件。
    app.use(bodyParser.urlencoded({ extended: false })); //加载解析urlencoded请求体的中间件。
    app.use(cookieParser()); //加载解析cookie的中间件。
    app.use(express.static(path.join(__dirname, 'public'))); //设置public文件夹为存放静态文件的目录。

    app.use('/', routes); //根目录的路由
    app.use('/users', users); //用户路由

    // catch 404 and forward to error handler 捕获404错误，并转发到错误处理器。
    app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handlers 错误处理器

    // development error handler 开发环境下的错误处理
    // will print stacktrace 将打印出堆栈信息
    if (app.get('env') === 'development') {
      app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: err
        });
      });
    }

    // production error handler 生产环境下的错误处理
    // no stacktraces leaked to user 不向用户暴露堆栈信息
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {}
      });
    });


    module.exports = app; // 导出app供 bin/www 使用
  ```
### bin/www
```
#!/usr/bin/env node  //表明是 node 可执行文件。

    /**
     * Module dependencies.
     */

    var app = require('../app'); //引入我们上面app.js导出的app实例
    var debug = require('debug')('myblog:server'); // 引入打印调试日志的debug模块，并设置名称。
    var http = require('http'); //引入http

    /**
     * Get port from environment and store in Express. 从环境变量中获取端口号并存放到express中
     */

    var port = normalizePort(process.env.PORT || '3000');// 设置端口号
    app.set('port', port); //设置端口号

    /**
     * Create HTTP server. 创建http服务器
     */

    var server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.// 在所有的网络接口中监听提供的端口
     */

    server.listen(port);
    server.on('error', onError); //监听错误事件
    server.on('listening', onListening); //启动工程并监听3000端口，成功后打印 Express server listening on port 3000。

    /**
     * Normalize a port into a number, string, or false. 把一个端口处理成一个数字或字符串或者false
     */

    function normalizePort(val) {
      var port = parseInt(val, 10);// 先试图转成10进制数字

      if (isNaN(port)) {
        // named pipe 转不成数字就当作命名管道来处理
        return val;
      }

      if (port >= 0) {
        // port number //如果端口大于0就返回端口
        return port;
      }

      return false;// 不是命名管道，也不是正常端口就返回false
    }

    /**
     * Event listener for HTTP server "error" event. 服务器的错误事件监听器
     */

    function onError(error) {
      if (error.syscall !== 'listen') { //如果系统调用不是监听则抛出错误
        throw error;
      }

      var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

      // handle specific listen errors with friendly messages 更友好的处理特定的监听错误
      switch (error.code) {// 错误编码
        case 'EACCES': //没有权限
          console.error(bind + ' requires elevated privileges'); //没有权限绑定指定的端口
          process.exit(1); //异常退出
          break;
        case 'EADDRINUSE': //端口被占用
          console.error(bind + ' is already in use');//端口被占用
          process.exit(1);//异常退出
          break;
        default:
          throw error; //其它的情况抛出错误并中止进程
      }
    }

    /**
     * Event listener for HTTP server "listening" event. 服务器的监听端口成功事件回调
     */

    function onListening() {
      var addr = server.address(); //取得服务器的地址
      var bind = typeof addr === 'string' //监听地址如果是字符串返回命名管道名，如果是数字返回端口
        ? 'pipe ' + addr
        : 'port ' + addr.port;
      debug('Listening on ' + bind); //记录日志
    }
```
### routes/index.js
```
var express = require('express'); //导入express模块
    var router = express.Router(); //生成一个路由实例

    /* GET home page.  取得主页*/
    router.get('/', function(req, res, next) {// 当用户访问根目录也就是 / 的时候执行此回调
      res.render('index', { title: 'Express' });// 渲染views/index.ejs模版并显示到浏览器中
    });

    module.exports = router; //导出这个路由并在app.js中通过app.use('/', routes); 加载
```
### views/index.ejs

#### 在渲染模板时我们传入了一个变量 title 值为 express 字符串，模板引擎会将所有 <%= title %> 替换为 express ，然后将渲染后生成的html显示到浏览器中
```
<!DOCTYPE html>
    <html>
      <head>
        <title><%= title %></title>
        <link rel='stylesheet' href='/stylesheets/style.css' />
      </head>
      <body>
        <h1><%= title %></h1>
        <p>Welcome to <%= title %></p>
      </body>
    </html>
```
## 工作原理

### routes/index.js 中有以下代码：
```
var express = require('express');
    var router = express.Router();

    /* GET home page. */
    router.get('/', function(req, res, next) {
      res.render('index', { title: 'Express' });
    });

    module.exports = router;
```
#### 这段代码的意思是当访问主页时，调用 ejs 模板引擎，来渲染 index.ejs 模版文件（即将 title 变量全部替换为字符串 Express），生成静态页面并显示在浏览器中。

## 路由配置

#### express 封装了多种 http 请求方式，主要只使用 get 和 post 两种，即 app.get() 和 app.post() 。 app.get() 和 app.post() 的第一个参数都为请求的路径，第二个参数为处理请求的回调函数，回调函数有两个参数分别是 req 和 res，代表请求信息和响应信息 。路径请求及对应的获取路径有以下几种形式：

#### req.query(处理 get 请求，获取查询字符串)
```
GET /index.html?name=jaune
    req.query.name  -> jaune
```
#### req.params(处理 /:name 形式的 get 或 post 请求，获取请求参数)
````
// GET /user/jaune
    req.params.name -> jaune
````
##### req.body(处理 post 请求，获取 post 请求体)
```
req.body.name
````
## 什么是模板引擎

#### 模板引擎（Template Engine）是一个将页面模板和要显示的数据结合起来生成 HTML 页面的工具。 如果说上面讲到的 express 中的路由控制方法相当于 MVC 中的控制器的话，那模板引擎就相当于 MVC 中的视图。

### ejs

##### ejs使用起来十分简单，而且与 express 集成良好。

### 使用模板引擎

#### 前面我们通过以下两行代码设置了模板文件的存储位置和使用的模板引擎：
```
app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
 ```
##### 注意：我们通过 express -e zhufengpeixunblog 只是初始化了一个使用 ejs 模板引擎的工程而已，比如 node_modules 下添加了 ejs 模块，views 文件夹下有 index.ejs 。并不是说强制该工程只能使用 ejs 不能使用其他的模板引擎比如 jade，真正指定使用哪个模板引擎的是 app.set('view engine', 'ejs'); 。

#### 在 routes/index.js 中通过调用 res.render() 渲染模版，并将其产生的页面直接返回给客户端。它接受两个参数，第一个是模板的名称，即 views 目录下的模板文件名，扩展名 .ejs 可选。第二个参数是传递给模板的数据对象，用于模板翻译。

#### 打开 views/index.ejs ，内容如下：

### index.ejs
```
var express = require('express');
    var router = express.Router();

    /* GET home page. */
    router.get('/', function(req, res, next) {
      res.render('index', { title: 'Express' });
    });

    module.exports = router;
 ```
#### 当我们 res.render('index', { title: 'Express' }); 时，模板引擎会把 <%= title %> 替换成 Express，然后把替换后的页面显示给用户。

#### 渲染后生成的页面代码为：
````
<!DOCTYPE html>
    <html>
      <head>
        <title>Express</title>
        <link rel='stylesheet' href='/stylesheets/style.css' />
      </head>
      <body>
        <h1>Express</h1>
        <p>Welcome to Express</p>
      </body>
    </html>
````
##### 注意：我们通过 app.use(express.static(path.join(__dirname, 'public'))) 设置了静态文件目录为 public 文件夹， 所以上面代码中的 href='/stylesheets/style.css' 就相当于 href='public/stylesheets/style.css' 。

#### ejs 的标签系统非常简单，它只有以下三种标签：

1. <% code %>：JavaScript 代码。
2. <%= code %>：显示替换过 HTML 特殊字符的内容。
3. <%- code %>：显示原始 HTML 内容。 注意： <%= code %> 和 <%- code %> 的区别，当变量 code 为普通字符串时，两者没有区别。当 code 比如为
```
hello
```
#### 这种字符串时，<%= code %> 会原样输出
````
hello
````
#### 而 <%- code %> 则会显示 H1 大的 hello 字符串。
### 页面布局

#### 这里我们不使用layout进行页面布局，而是使用更为简单灵活的include。include 的简单使用如下：

### index.ejs
```
<%- include a %>
    hello,world!
    <%- include b %>
 ```
### a.ejs
```
this is a.ejs
```
### b.ejs
```
this is b.ejs
 ```
#### 最终 index.ejs 会显示：
```
this is a.ejs
    hello,world!
    this is b.ejs
 ```
### 功能分析

#### 搭建一个简单的具有多人注册、登录、发表文章、登出功能的博客。

### 设计目标

1. 未登录：主页导航显示 首页、注册、登陆，下面显示已发表的文章、发表日期及作者。
2. 登陆后：主页导航显示 首页、发表文章、退出，下面显示已发表的文章、发表日期及作者。
3. 用户登录、注册、发表成功以及登出后都返回到主页。
## 安装数据库支持
```
npm install mongoose --save
```
#### 安装mongodb模块到node_modules下面并把此配置添加到package.json文件中

#### 在工程根目录下创建 settings.js 文件
```
module.exports = {
    cookieSecret:'myblogkey', //用于 Cookie 加密与数据库无关
        db:'myblog', //数据库的名称
        host:'localhost', //数据库的地址,本地连接
        port:27017,  //数据库的端口号
        url:"mongodb://localhost:27017/myblog"
}
 ````
### 编写数据库交互

#### 创建db文件夹

#### 在db文件夹下创建文件models.js

#### 此文件存放着所有的模型
````
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
module.exports = {
    User:{ //设置User的数据模型
        username:{type:String,required:true},//用户名
        password:{type:String,required:true},//密码
        email:{type:String,required:true},//邮箱
        avatar:{type:String}//头像
   },
Article: {
    comments: [{user:{type:ObjectId,ref:'User'},content:String,createAt:{type: Date, default: Date.now}}],
    pv: {type:Number,default:0},
    //设置文章的数据模型
    user:{type:ObjectId,ref:'User'}, //用户
    title: String, //标题
    content: String, //内容
    createAt:{type: Date, default: Date.now} //创建时间
   }
}
````
#### 在db文件夹下创建文件index.js
#### 此文件负责向外暴露模型,因为Model赋给了global作为属性，那就意味着在程序任何地方都可以调用了
````
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    models = require('./models');
var settings = require('../settings');
mongoose.connect(settings.url);
mongoose.model('User', new Schema(models.User));
mongoose.model('Article', new Schema(models.Article));
global.Model = function (type) {
    return mongoose.model(type);;
}
````
#### 在app.js中添加
````
require('./db'); //导入db模块
````

## 页面的实现

### 完善页面
### 在views新建header.ejs和footer.ejs文件
### header.ejs
````
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>LIMI博客</title>
    <link href="/lib/bootstrap/dist/css/bootstrap.css" rel="stylesheet">
    <link href="/stylesheet/style.css">
</head>
<body style="background: url('/images/body_bg.jpg') no-repeat;background-size:100% 100%;">
<!--最外面的容器nav标签，并添加nav-bar样式类，表示这里面属于导航条 -->
<nav class="navbar navbar-default" role="navigation">
    <!--第二步：增加header-->
    <div class="navbar-header">
        <!--最左侧的，默认不可见 按钮标签里嵌套了三个span的icon。然后给与navbar-toggle样式类和属性collapse(收起)，点击的时候目标为data-target。当窗口缩小到一定程度，右侧的效果显现。-->
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#menus">
            <span class="sr-only">LIML博客</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>
        <a href="/" class="navbar-brand">LIMI博客</a>
    </div>
    <!-- 放置其它的导航条 -->
    <div class="collapse navbar-collapse" id="menus">
        <ul class="nav navbar-nav">
            <%if(!user){%>
            <li class="active"><a href="/users/reg">注册</a></li>
            <li><a href="/users/login">登录</a></li>
            <%}else{%>
            <li><a href="/articles/add">发表文章</a></li>
            <li><a href="/users/logout">
                    <%=user.username%>注销</a></li>
            <%}%>
        </ul>
        <form class="navbar-right navbar-form" method="post" action="/articles/list/1/6">
            <div class="input-group has-feedback">
                <label class="sr-only" for="keyword"></label>
                <input type="text" class="form-control" placeholder="search" name="keyword" id="keyword">
                <span class="glyphicon glyphicon-search form-control-feedback"></span>
            </div>
            <button type="submit" class="btn  btn-default" value="search" name="searchBtn" >搜索</button>
        </form>
    </div>
</nav>
<div class ="container text-center">
    <%  if(success) {
    %>
    <div class="alert  alert-success" role="alert"><%=success%></div>
    <%
    }%>
    <%  if(error) {
    %>
    <div class="alert  alert-danger" role="alert"><%=error%></div>
    <%
    }%>
</div>
````
### footer.ejs
````
<script src="/lib/jquery/dist/jquery.js"></script>
<script src="/lib/bootstrap/dist/js/bootstrap.js"></script>
</body>
</html>
````
### 注册页面

#### 修改routes/users.js文件
````
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
module.exports = router;
````

#### 在views新建user/reg.ejs
````
<% include ../include/header.ejs%>
<div class="container">
    <form action="/users/reg" method="post"  role="form" class="form-horizontal">
        <div class="form-group">
            <label for="username" class="col-sm-2 control-label">用户名</label>
            <div class="input-group col-sm-10">
                <div class="input-group-addon"> <span class="glyphicon glyphicon-user"></span> </div>
                <input type="text" class="form-control" id="username" name="username" placeholder="用户名"/>
            </div>

        </div>
        <div class="form-group">
            <label for="email" class="col-sm-2 control-label">邮箱</label>
            <div class="input-group col-sm-10">
                <div class="input-group-addon"><span class="glyphicon glyphicon-envelope"></span></div>
                <input type="email" class="form-control" name="email" id="email" placeholder="邮箱"/>
            </div>
        </div>
        <div class="form-group">
            <label for="password" class="col-sm-2 control-label">密码</label>
            <div class="input-group col-sm-10">
                <div class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></div>
                <input type="password" class="form-control" name="password" id="password" placeholder="密码"/>
            </div>
        </div>
        <div class="form-group">
            <label for="repassword" class="col-sm-2 control-label">确认密码</label>
            <div class="input-group col-sm-10">
                <div class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></div>
                <input type="password" class="form-control" name="repassword" id="repassword" placeholder="确认密码"/>
            </div>
        </div>
        <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
                <button type="submit" class="btn btn-default">提交</button>
                <button type="reset" class="btn btn-default">重置</button>
            </div>
        </div>

    </form>
</div>
<% include ../include/footer.ejs%>
````
### 登录页面
#### 修改routes/users.js文件
````
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
````

#### 在views新建user/login.ejs
````
<% include ../include/header.ejs%>
<div class="container">
    <form action="/users/login" method="post"  role="form" class="form-horizontal">
        <div class="form-group">
            <label for="username" class="col-sm-2 control-label">用户名</label>
            <div class="input-group col-sm-10">
                <div class="input-group-addon"> <span class="glyphicon glyphicon-user"></span> </div>
                <input type="text" class="form-control" id="username" name="username" placeholder="用户名"/>
            </div>

        </div>
        <div class="form-group">
            <label for="password" class="col-sm-2 control-label">确认密码</label>
            <div class="input-group col-sm-10">
                <div class="input-group-addon"><span class="glyphicon glyphicon-lock"></span></div>
                <input type="password" class="form-control" name="password" id="password" placeholder="密码"/>
            </div>
        </div>
        <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
                <button type="submit" class="btn btn-default">提交</button>
                <button type="reset" class="btn btn-default">重置</button>
            </div>
        </div>

    </form>
</div>
<% include ../include/footer.ejs%>
````
### 文章的发表

#### 在routes新建article.js文件
````
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
module.exports = router;
````
#### 在views新建article/add.ejs文件
````
<% include ../include/header.ejs%>
<div class="container">
    <form action="/articles/add" method="post"  role="form" class="form-horizontal">
        <div class="form-group">
            <label for="title" class="col-sm-2 control-label">标题</label>
            <div class="col-sm-10">
                <input type="text" value="" class="form-control" id="title" name="title" placeholder="标题"/>
            </div>
        </div>
        <div class="form-group">
            <label for="content" class="col-sm-2 control-label">正文</label>
            <div class="col-sm-10">
                <textarea class="form-control"   id="" cols="30" rows="10" id="content" name="content" placeholder="请输入内容"></textarea>
            </div>
        </div>
        <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
                <button type="submit" class="btn btn-default">提交</button>
                <button type="reset" class="btn btn-default">重置</button>
            </div>
        </div>
    </form>
</div>
<% include ../include/footer.ejs%>
````
### 文章详情
#### 修改routes/article.js文件
````
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
````
#### 在views新建article/detail.ejs文件
 ````
<% include ../include/header.ejs%>
<div class="container">
    <div class="panel panel-primary">
        <div class="panel-heading">
            <%=article.title%>
        </div>
        <div class="panel-body">

            发表时间:<%=article.createAt.toLocaleString()%><br/>
            <%-article.content%>
        </div>
        <%if(user && user._id == article.user){%>
        <div class="panel-footer">
            <a href="/articles/edit/<%=art._id%>" class="btn btn-warning">编辑</a>
            <a href="/articles/delete/<%=art._id%>" class="btn btn-danger">删除</a>
        </div>
        <%}%>
    </div>
</div>
<% include ../include/footer.ejs%>
````

### 修改和删除
#### 修改routes/article.js文件
````
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
````
#### 在views新建article/editArticle.ejs文件
````
<% include ../include/header.ejs%>
<div class="container">
    <form action="/articles/edit/<%=art._id%>" method="post" role="form" class = "form-horizontal">
        <div class="form-group">
            <label for="title" class="control-label col-sm-2">标题</label>
            <div class="input-group col-sm-10">
                <input type="text" name="title" id="title" class="form-control"  value="<%=art.title%>" placeholder="标题">
            </div>
        </div>
        <div class="form-group">
            <label for="content" class="control-label col-sm-2">正文</label>
            <div class="input-group col-sm-10">
                <textarea name="content" id="content" class="form-control" cols="30" rows="20" placeholder="请输入文章内容"><%=art.content%></textarea>
            </div>
        </div>
        <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
                <button type="submit" class="btn btn-default">提交</button>
                <button type="reset" class="btn btn-default">重置</button>
            </div>
        </div>
    </form>
</div>
<% include ../include/footer.ejs%>
````
## 搜索和分页
### 在首页增加分页条
#### 修改views/index.ejs
````
 <ul class="pagination">
         <%
             //求出总页数
         var total=Math.ceil(count/pageSize)
         for(var i=1;i<=total;i++){
         %>
         <li><a href="/articles/list/<%=i%>/<%=pageSize%>?keyword=<%=keyword%>"><%=i%></a></li>
         <%
         }
         %>
     </ul>
````
### 首页导航重定向到文章列表页

#### 修改routes/index.js
````
router.get('/', function(req, res, next) {
    Model('Article').find({}).populate('user').exec(function(err,articles){
        articles.forEach(function (article) {
            article.content = markdown.toHTML(article.content);
        });
        res.render('index', {title: '主页',articles:articles});
    });
    req.session.keyword=null;
    res.redirect('/articles/list/1/6');
});
````
### 增加文章列表导航

#### 修改routes/article.js
````
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
````
## 评论和评论数
#### 修改routes/article.js
````
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
````
##### 修改views/article/detail.ejs
````
 <div class="panel panel-default">
        <div class="panel-heading">
            评论列表
        </div>
        <div class="panel-body"  style="height:300px;overflow-y: scroll">
            <ul class="media-list">
                <%
                article.comments.forEach(function(comment){
                %>
                <li class="media">
                    <div class="media-left">
                        <a href="#">
                            <img class="media-object" src="<%=comment.user.avatar%>" alt="">
                        </a>
                    </div>
                    <div class="media-body">
                        <p class="media-left"><%- comment.content%></p>
                    </div>
                    <div class="media-bottom">
                        <%=comment.user.username%> <%=comment.createAt.toLocaleString()%>
                    </div>
                </li>
                <%
                });
                %>
            </ul>
        </div>

    </div>

    <div class="panel panel-default">
        <form action="/articles/comment" method="post">
            <input type="hidden" value="<%=article._id%>" name="_id"/>
            <div class="panel-body">
                <textarea class="form-control"   id="" cols="30" rows="10" id="content" name="content" placeholder="请输入评论" ></textarea>
            </div>
            <div class="panel-footer">
                <button type="submit" class="btn btn-default">提交</button>
            </div>
        </form>
    </div>
 ````
## 美化404
#### 修改404中间件
#### 修改 app.js
````
 // catch 404 and forward to error handler
 app.use(function(req, res, next) {
   var err = new Error('Not Found');
   err.status = 404;
   res.render("404");
   next(err);
 });
 ````
#### 增加404页面模板
#### 新建views/404.ejs文件
````
 <% include include/header.ejs%>
 <div class="container">
     <img src="http://7xjf2l.com2.z0.glb.qiniucdn.com/20131122112727-1356352347.jpg" alt="404"/>
 </div>
 <% include include/footer.ejs%>
 ````
## 打印日志
#### 给博客增加日志，实现访问日志（access.log）和错误日志（error.log）功能

#### 把日志保存为日志文件

#### 修改app.js
````
//正常日志
var accessLog = fs.createWriteStream('access.log', {flags: 'a'});
app.use(logger('dev',{stream: accessLog}));

//错误日志
var errorLog = fs.createWriteStream('error.log', {flags: 'a'});
app.use(function (err, req, res, next) {
    var meta = '[' + new Date() + '] ' + req.url + '\n';
    errorLog.write(meta + err.stack + '\n');
    next();
});
````
