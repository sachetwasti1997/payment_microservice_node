import express, { NextFunction, Request, Response } from "express";
import { Order } from "../models/order";
import { authorisedCheck, validateRequest } from "@ticketingplatform/common";
import { body } from "express-validator";
import { doPayment } from "../service/service";

const router = express.Router();

router.post(
  "/api/payments",
  authorisedCheck,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("In Payment Service");
      
      const { token, orderId } = req.body;
      console.log("In Payment Service", token, orderId, "calling do Payment");
      const paymentId = await doPayment(token, orderId, req.currentUser!.id);
      res.status(201).send({ id: paymentId });
    } catch (err) {
      console.log(err);
      
      return next(err);
    }
  }
);

export { router as PaymentRouter };
