var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var request = require('request');
var app = express();

var session = require('express-session');
var bcrypt = require('bcrypt');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

/* SESSION */
app.use(session({
    secret: 'top secret code!', //doesn't matter what this says
    resave: true,
    saveUninitialized: true
}));
app.set('view engine', 'ejs');



const connection = mysql.createConnection({
    host: process.env.HOST, //local
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});
connection.connect(); 



function isAuthenticated(req, res, next){
    if(!req.session.authenticated) res.redirect('/login');
    else next();
}


function checkUsername(username){
    let stmt = 'SELECT * FROM user WHERE username=?';
    return new Promise(function(resolve, reject){
       connection.query(stmt, [username], function(error, results){
           if(error) throw error;
           resolve(results);
       }); 
    });
}

function checkPassword(password, hash){
    return new Promise(function(resolve, reject){
       bcrypt.compare(password, hash, function(error, result){
          if(error) throw error;
          resolve(result);
       }); 
    });
}

//-------------------------------- PATHS

//HOME
app.get('/', function(req, res){
    var stmt ="SELECT * FROM product;";
    connection.query(stmt, function(error, result) {
       if(error) throw error; 
       res.render('home', {query : "", loggedIn : req.session.authenticated, grasses : result});
    });
    
});

//*************************************************************** Product queries
app.get('/getProductSearch', function(req, res) {
    var keywords = req.query.keywords.split(" ");
    keywords = keywords.filter(Boolean);
    let query_len = keywords.length;
    
    if(query_len === 0) {
        keywords.push("");
        query_len++;
    }
    
    var stmt = 'SELECT * FROM product WHERE name LIKE CONCAT("%", ?, "%")'; // had to use concat!
    
    if(query_len > 1) {
        for(var i = 1; i < query_len; i++) {
            stmt += 'OR name LIKE CONCAT("%", ?, "%")';
        }
    }
    stmt += ";";
    
    connection.query(stmt, keywords, function(error, result) {
        if(error) throw error;
        console.log(result); // just to see what it is
        
        res.render('search', {grass : result, term : req.query.keywords, loggedIn : req.session.authenticated})
    });
});

app.get('/getSpecificSearch/:id', function(req, res) {
    var userQuery = [req.params.id];
    var stmt = "SELECT * FROM product_details WHERE product_details_id = ?;";
    
    connection.query(stmt, userQuery, function(error, result) {
        if(error) throw error;
        console.log(result); // just to see what it is 
        
        res.json({grass:result[0]});
    });
});


app.get('/userCartAdd/:id/:amount', isAuthenticated, function(req, res) {
    var user = req.session.userInfo;
    var stmt = 'insert into shopping_cart (product_id, user_id, quantity) values (?, ?, ?)';
    var data = [req.params.id, user.user_id, req.params.amount];
    
    var stmt2 = 'update product set carried_quantity = carried_quantity - ? where product_id = ?';
    var data2 = [req.params.amount, req.params.id];
    
    connection.query(stmt, data, function(error, result) {
       if(error) throw error;
       
       connection.query(stmt2, data2, function(error, result) {
            if(error) throw error;
            
            res.json({newGrass:result[0]});
        });
    });
    
});

app.get('/userCartDelete/:id/:amount', isAuthenticated, function(req, res) {
    var stmt = 'delete from shopping_cart where cart_id = ?;';
    
    var stmt2 = 'update product set carried_quantity = carried_quantity + ? where product_id = ?';
    var data2 = [req.params.amount, req.params.id];
    
    connection.query(stmt, req.params.id, function(error, result) {
        if(error) throw error;
    
        
        connection.query(stmt2, data2, function(error, result) {
            if(error) throw error;
           
           res.json({newGrass:result[0]});
        });
    });
    
});


// Used for testing the userCart add and delete
app.get('/userCS/', isAuthenticated, function(req, res) {
    var userQuery = [req.params.id];
    var stmt = "SELECT * FROM shopping_cart";
    
    var yes;
    
    connection.query(stmt, function(error, result) {
        if(error) throw error;
        console.log(result);
        
        yes = result;
        
        res.json({grass:result})
    });
    
    // var userQuery = [req.params.id];
    // var stmt = "SELECT * FROM product";
    
    // connection.query(stmt, function(error, result) {
    //     if(error) throw error;
    //     console.log(result);
        
    //     res.json({grass:result, newGRASSSSS:yes});
    // });
});


//*************************************************************** Login and Register Routes

/* Login Routes */
app.get('/login', function(req, res){
    res.render('login');
});

app.post('/login', async function(req, res){
    let isUserExist   = await checkUsername(req.body.username);
    let hashedPasswd  = isUserExist.length > 0 ? isUserExist[0].password : '';
    let passwordMatch = await checkPassword(req.body.password, hashedPasswd);
    if(passwordMatch){
        req.session.authenticated = true;
        req.session.userInfo = isUserExist[0];
        res.redirect('/');
    }
    else{
        res.render('login', {error: true});
    }
});

/* Register Routes */
app.get('/register', function(req, res){
    let anError = req.query.issue;
    if(anError == undefined)
    {
        anError = "none";
    }
    res.render('register', {issue : anError});
});

app.post('/register', async function(req, res){
    var firstName = req.body.firstname;
    var lastName = req.body.lastname;
    var address = req.body.address;
    var username = req.body.username;
    var password = req.body.password;
    var passwordConfirm = req.body.passwordConfirm;
    
    var dbQueryResult = await checkUsername(username);
    var areSame = password === passwordConfirm;
    
    let issueRedirect = "/register?issue=";
    
    //If the db has a record with the username, we will redirect to the register and let the user know.
    if(dbQueryResult.length > 0) {
        res.redirect(issueRedirect + "username+is+already+taken");
        return;
    }
    
    //If the passwords do no match, the user will be redirected back to the register page and will see a message
    if(!areSame) {
        res.redirect(issueRedirect + "passwords+do+not+match");
        return;
    }
    
    //create user and save in the DB
    let salt = 10;
    bcrypt.hash(password, salt, function(error, hash){
        if(error) throw error;
        let stmt = 'INSERT INTO user (first_name, last_name, address, username, password, is_admin) VALUES (?, ?, ?, ?, ?, ?)';
        let data = [firstName, lastName, address, username, hash, false];
        connection.query(stmt, data, function(error, result){
           if(error) throw error;
           res.redirect('/login');
        });
    }); 
});
//***************************************************************************




/* Home Route (with login) */
app.get('/loginHome', isAuthenticated, function(req, res){
    res.redirect('/');
});


app.get('/productDetail/:id/:productId', function(req, res) { // first Id is the specific id, and then the product
    var userQuery = [req.params.id];
    var stmt = "SELECT * FROM product_details WHERE product_details_id = ?;";
    
    connection.query(stmt, userQuery, function(error1, result1) {
        if(error1) throw error1;
        else{
            console.log(result1); // to see what it is 
            
            var userQuery2 = [req.params.id];
            var stmt2 = "SELECT * FROM product WHERE product_id = ?;";
            connection.query(stmt2, userQuery2, function(error2, result2) {
                if(error2) throw error2;
                else{
                    console.log(result2);
                    if(req.session.authenticated){
                        
                        res.render('productDetails', {loggedIn: true, user: req.session.userInfo, grassSpecific: result1[0], grassGeneral: result2[0]}); // need a productDetails view
                    }
                    else{
                        res.render('productDetails', {loggedIn: false, grassSpecific: result1[0], grassGeneral: result2[0]});
                    }
                }
            });
        }
    });
});

app.get('/userCart', function(req, res) {
    var user = [req.session.userInfo.user_id];
    var stmt = "SELECT *" + 
    " from (SELECT shopping_cart.user_id, shopping_cart.cart_id, shopping_cart.product_id, shopping_cart.quantity, product.image, product.name, product.short_desc"+
    " FROM shopping_cart inner join product on shopping_cart.product_id=product.product_id) as tbl1 where tbl1.user_id= ?;";
    // FROM SELECT * FROM shopping_cart WHERE user_id=?;
    connection.query(stmt, user, function(error, result) {
        if(error) throw error;
        else{
            console.log(result);
            res.render('userCart', {user: req.session.userInfo, grasses: result});
        }
    });
});


//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- Admin route!
app.get('/leAdmin', function(req, res) {
    
    try { // many answers to the same thing
        if(!(req.session.userInfo.is_admin)){
            // res.render('home', {query : "", loggedIn : req.session.authenticated});
            res.redirect("/");
        }
        else{
            var stmt = "select * from product;";
            connection.query(stmt, function(error, result){
                if(error) throw error;
                else{
                    console.log("admin logged in");
                    res.render('leAdmin', {grasses: result});
                }
            });
        }
    }
    catch(err) {
        console.log("Failed to sign in");
        // res.render('home', {query : "", loggedIn : req.session.authenticated});
        res.redirect("/");
    }

    
});

app.get('/adminAdd/:id/:quantity', isAuthenticated, function(req, res) { // id is from product

    if(req.session.userInfo.is_admin){
        var stmt2 = 'update product set carried_quantity = carried_quantity + ? where product_id = ?';
        var data2 = [req.params.quantity, req.params.id];
        
        connection.query(stmt2, data2, function(error, result) {
            if(error) res.json({newGrass:error[0]});
            else{
                res.json({newGrass:result[0]});
            }
        });
    }
    else{
    res.render('home', {query : "", loggedIn : req.session.authenticated});
    }
});

app.get('/adminSub/:id/:quantity', isAuthenticated, function(req, res) { // id is from product

    if(req.session.userInfo.is_admin){
        var stmt2 = 'update product set carried_quantity = carried_quantity - ? where product_id = ?';
        var data2 = [req.params.quantity, req.params.id];
        
        connection.query(stmt2, data2, function(error, result) {
            if(error) res.json({newGrass:error[0]});
            else{
                res.json({newGrass:result[0]});
            }
        });
    }
    else{
    res.render('home', {query : "", loggedIn : req.session.authenticated});
    }
});

app.post('/productInsert', function(req,res){
    // /productInsert/:name/:image/:short/:carried/:color/:price/:sq_ft/:long
    if(req.body.name.length > 30 || req.body.image.length > 200 || req.body.short.length > 50 || (isNaN(req.body.carried)) 
    || req.body.color.length > 20 || (isNaN(req.body.price)) || (isNaN(req.body.sq_ft)) || req.body.long.length > 500){
        
        console.log("data was wrong");
        return res.redirect("/leAdmin");
    }

    
    var data1 = [req.body.color, req.body.price, req.body.sq_ft, req.body.long];
    var stmt1 = 'insert into product_details (color, price, sq_ft, long_description) values (?, ?, ?, ?);';
    
    
    connection.query(stmt1, data1, function(error1, result1) { // make the details first
        if(error1) {console.log(error1); res.redirect("/leAdmin");}
        else{
            var stmt2 = "select max(product_details_id) as idd from product_details;";
            
            connection.query(stmt2, function(error2, result2) {
                if(error2) {console.log(error2); res.redirect("/leAdmin")}
                else{
                    console.log("data for the insert product:", result2[0]["idd"]); // get the product_details_id
                    
                    var data3 = [req.body.name, req.body.image, req.body.short, req.body.carried, result2[0]["idd"]];
                    var stmt3 = "insert into product(name, image, short_desc, carried_quantity, product_details_id) VALUES (?,?,?,?,?);";
                    
                    connection.query(stmt3, data3, function(error3, result3) {
                        if(error3) {console.log(error3); res.redirect("/leAdmin");}
                        else{
                            console.log("success!!!! added the thing, check it :", result3);
                            res.redirect("/leAdmin")
                        }
                    })
                    
                }
            });
            
        }
    });

});



//****************************************
/* Logout Route */
app.get('/logout', function(req, res){
   req.session.destroy();
   res.redirect('/');
});

//****************************************

//ERROR
app.get('/*', function(req, res){
   res.send('error'); 
});

app.listen(process.env.PORT || 3000, function(){
    console.log('Server started');
});