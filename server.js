import express from "express";
import proxy from "express-http-proxy";

const app = express();
app.use("/google", proxy("https://maps.googleapis.com"));

app.use(express.static("dist/private-google-places"));

app.listen(4200);
