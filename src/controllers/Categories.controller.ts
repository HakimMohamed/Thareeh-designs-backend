import { NextFunction, Request, Response } from 'express';
import { SubmitUserTicket } from '../dtos/ticket.dto';
import TicketService from '../services/Ticket.service';
import { GetUserTicketsResponse } from '../types/tickets';
import AuthService from '../services/Auth.service';
import categoriesService from '../services/categories.service';

export async function getCategories(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const categories = await categoriesService.getCategories();

    res.status(200).send({
      message: `Categories fetched successfully.`,
      data: categories,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}
