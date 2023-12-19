const { connect } = require('mongoose');

const connectDatabase = async () => {
    try {
        const connection = await connect(process.env.MONGO_URI);

        console.log(`MongoDB connected to: ${connection.connection.host}`);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDatabase;