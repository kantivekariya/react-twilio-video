import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import roomsRouter from "./src/routes/room"; /* NEW */

// create express server
const app = express();

// body parcer
app.use(bodyParser.json());

// to handle cors error
const corsOpts = {
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOpts));

// Forward requests for the /rooms URI to our rooms router
app.use("/rooms", roomsRouter); /* NEW */

app.listen(5000, () => {
  console.log("Express server listening on port 5000");
});
