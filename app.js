var express 			= require("express"),
	app 				= express(),
	bodyParser 			= require("body-parser"),
	mongoose 			= require("mongoose"),
	passport			= require('passport'),
	LocalStrategy 		= require('passport-local'),
	methodOverride		= require('method-override'),
	User 				= require("./models/user"),
	Yemek 				= require("./models/yemek"),
	Yorum 				= require('./models/yorum'),
	cerezData			= require("./cerez");

mongoose.connect("mongodb://localhost/yemekSitesi",{useMongoClient: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));

// console.log(__dirname);

// cerezData();

//Passport Config
app.use(require("express-session")({
	secret:"bu bizim gizli cumlemiz",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Butun Route'lar ile paylasilan bilgiler
app.use(function(req, res, next){
	res.locals.currentUser=req.user;
	next();
});



//==================================
app.get("/", function(req, res){
	res.render("home");
});

app.get("/yemekler", function(req, res){
	//yemekleri database'den al
	Yemek.find({}, function(err, yemeklerDB){
		if(err){
			console.log(err);
		} else{
			console.log("*******************YEMEKLER********************");
			console.log(yemeklerDB);
			res.render("yemekler/yemekler", {yemekler:yemeklerDB});
		}
	});
	/*res.render("yemekler", {yemekler:yemekler})*/
});

app.post("/yemekler",kullaciniGirisi, function(req, res){
	/*res.send("test");*/
	var adi = req.body.adi;
	var resim = req.body.resim;
	var aciklama = req.body.aciklama;
	var olusturan = { id: req.user._id,username: req.user.username }

	var yeniYemek = {adi:adi, resim:resim, aciklama:aciklama, olusturan: olusturan};
	/*yemekler.push(yeniYemek);*/

	//yeni yemek olustur ve db'ye kaydet
	Yemek.create(yeniYemek, function(err , yeniOlusturulmusYemek){
		if(err){
			console.log(err);
			res.redirect("/");
		} else{
			res.redirect("/yemekler");
		}
	});
	
});

app.get("/yemekler/yeni", kullaciniGirisi, function(req, res){
	res.render("yemekler/yeni");
});

app.get("/yemekler/:id", function(req, res){
	Yemek.findById(req.params.id).populate("yorumlar").exec(function(err, bulunanYemek){
		if(err){
			console.log(err);
		} else{
			res.render("yemekler/goster",{yemek : bulunanYemek});
		}
	});
	
});


//Yemek Guncelleme
app.get("/yemekler/:id/duzenle", kullaciniGirisi, function(req, res){
	Yemek.findById(req.params.id, function(err, bulunanYemek){
		if(err){
			console.log(err);
			res.redirect("/yemekler")
		} else {
			res.render("yemekler/duzenle",{yemek:bulunanYemek});

		}
	});
});

app.put("/yemekler/:id", kullaciniGirisi, function(req, res){
	Yemek.findByIdAndUpdate(req.params.id, req.body.yemek, function(err, guncellenmisYemek){
		if(err){
			console.log(err);
			res.redirect("/yemekler");
		} else {
			res.redirect("/yemekler/"+req.params.id);
		}
	});
});

//Yemek Silme
app.delete("/yemekler/:id", kullaciniGirisi, function(req, res){
	Yemek.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
			res.redirect("/yemekler");
		} else {
			res.redirect('/yemekler');
		}
	});
});


//=========== USER ROUTE ========================
app.get("/user/:id/profile",kullaciniGirisi, function(req, res){
	Yemek.find({}, function(err, yemeklerDB){
		if(err){
			console.log(err);
		} 
		res.render("userProfile",{yemekler:yemeklerDB});
	});

	
});


// ==========YORUM ROUTE ========================

app.get("/yemekler/:id/yorumlar/yeni", kullaciniGirisi, function(req, res){
	Yemek.findById(req.params.id, function(err, bulunanYemek){
		if (err) {
			console.log(err);
		} else{
			res.render("yorumlar/yeni", {yemek : bulunanYemek});
		}
	});
});

app.post("/yemekler/:id/yorumlar", kullaciniGirisi, function(req, res){
		Yemek.findById(req.params.id, function(err, bulunanYemek){
		if (err) {
			console.log(err);
			res.redirect("/yemekler");
		} else{
			Yorum.create(req.body.yorum, function(err, yorum){
				yorum.yazar.id = req.user._id;
				yorum.yazar.username = req.user.username;
				yorum.save();

				bulunanYemek.yorumlar.push(yorum);
				bulunanYemek.save();
				res.redirect('/yemekler/' + bulunanYemek._id);
			});
		}
	});
});
//==================== ADMIN ROUTES ============================
function generateID(){
    var id = "";
    var anahtarlar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var uzunluk = 100;
    for(var i = 0 ; i < uzunluk ; i++){
        id += anahtarlar.charAt(Math.floor(Math.random() * anahtarlar.length));
        // console.log(i);
        // console.log(Math.floor(Math.random() * anahtarlar.length));
        // console.log(id);
    }
    return id;
}


app.get("/admin/validator", function(req, res){
	res.render("admin/validator");
});

app.post("/admin/validator", function(req, res){
	var secret = req.body.secret;
	//console.log(secret);
	if(	secret == "nodejsogreniyorum" ){
		var retrievedID = generateID();
		console.log(retrievedID);
		app.set('id', retrievedID);
		res.send(retrievedID);
	} else {
		console.log("Wrong Key");
		res.redirect("/admin/validator");
	}
});

app.get("/admin/giris", function(req, res){
	res.render("admin/adminForm");
});

app.post("/admin/giris", function(req, res){
	var adminID = req.body.id;
	// console.log(adminID);
	if( app.get('id') == adminID  ){
		User.find({}, (err, usersDB) => {
			res.render("admin/infos", {users:usersDB});
		});
	} else {
		res.redirect("/yemekler");
	}
});




//==================== AUTH ROUTES =============================
//Kaydol
app.get("/kaydol", function(req, res){
	res.render("kaydol");
});

app.post("/kaydol", function(req ,res){
	var yeniKullanici = new User({username: req.body.username});
	User.register(yeniKullanici, req.body.password, function(err, kullanici){
		if(err){
			console.log(err);
			return res.render("kaydol");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/yemekler");
		});
	});
});

//Giris Yap
app.get("/girisyap", function(req, res){
	res.render("giris");
});

app.post("/girisyap",passport.authenticate("local",{
			successRedirect: "/yemekler",
			failureRedirect:"/girisyap"
		}),
	function(req, res){
});

//Cikis Yap
app.get("/cikisyap", function(req, res){
	req.logout();
	res.redirect("/");
});

//=========== MIDDLE WARE ================
function kullaciniGirisi(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/girisyap");
}

//===============================================================
var server = app.listen(3000, function(){
	console.log("Sunucu Portu : %d", server.address().port);
});