import { ITicket } from '../models/Ticket';
import { BaseResponse } from './response';

export interface GetUserTicketsResponse extends BaseResponse {
  data: ITicket[] | null;
}
