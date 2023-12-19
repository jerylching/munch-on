require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDatabase = require("./config/database.js");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const app = express();

const PORT = process.env.PORT || 8080;
const baseURL = "/api";

connectDatabase();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());

app.use(`${baseURL}/users`, require("./routes/user.route.js"));
app.use(`${baseURL}/mealplans`, require("./routes/mealPlans.route.js"));
app.use(`${baseURL}/recipes`, require("./routes/recipes.route"));
app.use(`${baseURL}/pantry`, require("./routes/pantryItems.route"));
app.use(`${baseURL}/grocery`, require("./routes/groceryList.route"));

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
