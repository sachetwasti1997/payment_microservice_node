import express, { NextFunction, Request, Response, Router } from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { errorHandler } from "@ticketingplatform/common";
import { NotFoundError, currentUser } from "@ticketingplatform/common";
import { PaymentRouter } from "./routes/routes";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);
app.use(currentUser);
app.use(PaymentRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  return next(new NotFoundError());
});

app.use(errorHandler);
export { app };
