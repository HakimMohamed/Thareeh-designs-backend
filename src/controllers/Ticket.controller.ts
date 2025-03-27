import { NextFunction, Request, Response } from 'express';
import { SubmitUserTicket } from '../dtos/ticket.dto';
import TicketService from '../services/Ticket.service';
import { GetUserTicketsResponse } from '../types/tickets';
import AuthService from '../services/Auth.service';

export async function submitTicket(
  req: Request<{}, {}, SubmitUserTicket>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { subject, description } = req.body;

  const userId = req.user?.userId!;

  try {
    const user = await AuthService.getUserById(userId);
    await TicketService.submitTicket(user!, subject, description);

    res.status(200).send({
      message: `Ticket submitted successfully.`,
      data: null,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}

export async function getUserTickets(
  req: Request,
  res: Response<GetUserTicketsResponse>,
  next: NextFunction
): Promise<void> {
  const userId = req.user?.userId!;

  try {
    const tickets = await TicketService.getUserTickets(userId);

    res.status(200).send({
      message: `Tickets fetched successfully.`,
      data: tickets,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
}
