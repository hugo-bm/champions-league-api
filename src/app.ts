import express  from "express";
import "express-async-errors";
import helmet from "helmet";
import cors from 'cors';
import { createServer } from "node:http";
import { buildRouter } from "./container";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

//app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(buildRouter());
app.use(errorHandler);

export default createServer(app);  