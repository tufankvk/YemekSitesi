var mongoose = require("mongoose");

var yemekSchema = new mongoose.Schema({
	adi			: String,
	resim		: String,
	aciklama	: String,
	olusturan 	: 
		{
			id:
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User"
			},
			username : String
		},
	yorumlar	:
			[{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Yorum"
			}]
});
module.exports = mongoose.model("Yemek", yemekSchema);