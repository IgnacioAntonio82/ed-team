const mongoose=require("mongoose");

mongoose
.connect("mongodb://localhost/edteam_electron")
.then(db=>console.log("MONGODB Conectado"))
.catch(error=>console.log(error))