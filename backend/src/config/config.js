import dotenv from 'dotenv';

dotenv.config();

if(!process.env.PORT || !process.env.MONGO_URI || !process.env.JWT_SECRET){
    throw new Error('Missing environment variables');
}

const config = {
    PORT: process.env.PORT || 3001,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
};

export default config;