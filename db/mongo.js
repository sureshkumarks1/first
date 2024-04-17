const mongoose = require('mongoose')
try {
    mongoose.connect(process.env.MONGODB_URL,{}).then(console.log("connected succesfully"))    
} catch (error) {
    console.log(error.message)
}