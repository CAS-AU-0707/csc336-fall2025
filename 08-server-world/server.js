import express from "express";
import fs from "fs";

const app = express();

app.use(express.static("./public"));
app.use(express.json());
