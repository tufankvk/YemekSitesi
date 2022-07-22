var mongoose = require("mongoose");
var Yemek 	 = require("./models/yemek");
var Yorum	 = require("./models/yorum");

var data = [
	{
		adi:"Muz Dilimli Pancake",
		resim:"https://cdn.pixabay.com/photo/2016/03/09/22/50/food-1247612__340.jpg",
		aciklama:"Lorem ipsum dolor sit amet, cu cum augue docendi consequuntur, mel ei nisl sint sadipscing. "
	},
	{
		adi:"Tavuk Izgara",
		resim:"https://cdn.pixabay.com/photo/2016/08/30/18/45/grilled-1631727__340.jpg",
		aciklama:"Lorem ipsum dolor sit amet, cu cum augue docendi consequuntur, mel ei nisl sint sadipscing. "
	},
	{
		adi:"Vitamin Salatasi",
		resim:"https://cdn.pixabay.com/photo/2015/04/10/00/41/food-715542__340.jpg",
		aciklama:"Lorem ipsum dolor sit amet, cu cum augue docendi consequuntur, mel ei nisl sint sadipscing. "
	}
];

function cerezData(){
	//Butun yemekleri veritabanindan sil
	Yemek.remove({}, function(err){
		// if (err) {
		// 	console.log(err);
		// }
		// console.log("Yemekler Veritabanindan Silindi...");

		// 	//Yeni yemekler ekle
		// 	data.forEach(function(degisken){
		// 		Yemek.create(degisken, function(err, yemek){
		// 			if (err) {
		// 				console.log(err);
		// 			} else {
		// 				console.log("Yeni Yemek Eklendi.");

		// 				//Yeni yorum ekle
		// 				Yorum.create({
		// 					text:"Bu bir deneme yorumudur.",
		// 					yazar:"Ugurcan Cetin"
		// 				}, function(err, yorum){
		// 					if (err) {
		// 						console.log(err);
		// 					} else {
		// 						yemek.yorumlar.push(yorum);
		// 						yemek.save();
		// 						console.log("Yeni yorum eklendi.")
		// 					}
		// 				});
		// 			}
		// 		});
		// 	});
	});
};

module.exports = cerezData;