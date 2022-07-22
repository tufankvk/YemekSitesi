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

console.log(generateID());