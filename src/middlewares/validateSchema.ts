import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

const validateSchema = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).send({ message: errors.array()[0].msg, success: false, data: null });
    return;
  }

  next();
};

export default validateSchema;
