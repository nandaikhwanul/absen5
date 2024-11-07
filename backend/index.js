import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import Dosen from "./models/DosenModel.js"; // Import the Dosen model

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});

(async () => {
    await db.sync(); // Ensure all models are synced, including Dosen
})();

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(UserRoute);
app.use(AuthRoute);

// Uncomment if you want the session store to also sync tables
// store.sync();

app.listen(process.env.APP_PORT, () => {
    console.log('Server up and running...');
});
