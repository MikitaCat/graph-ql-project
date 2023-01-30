const express = require("express");
require("dotenv").config();

const { graphqlHTTP } = require("express-graphql");

const schema = require("./schemas/schema");

const port = process.env.PORT || 5000;

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

app.listen(port, console.log(`Server started on port ${port}`));
