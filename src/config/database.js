const mongoose = require('mongoose')

const url = process.env.MONGODB_URL;

const dbConnect = async () => {
	try {
		await mongoose.connect(`${url}`);
		console.log("Db connection successful")
	}
	catch(err) {
		console.log("Error in DB Connection: ", err);
	}
}

module.exports = dbConnect;