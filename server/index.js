const express = require("express");
const colors = require("colors");
require("dotenv").config();

const { graphqlHTTP } = require("express-graphql");

const schema = require("./schemas/schema");

const connectDB = require("./config/db");

const port = process.env.PORT || 5000;

//DataBase commection
connectDB();

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

app.listen(port, console.log(`Server started on port ${port}`));
