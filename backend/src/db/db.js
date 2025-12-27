const mongoose = require('mongoose');

async function ConnectToDb() {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Connected to Database");

    }
    catch (err) {
        console.log(err);

    }


}
module.exports = ConnectToDb