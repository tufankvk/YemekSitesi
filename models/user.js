var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    yemekler: [{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Yemek"
        },
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

    }]
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);