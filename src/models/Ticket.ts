import mongoose, { ObjectId, Schema } from 'mongoose';

export interface ITicket extends Document {
  _id: ObjectId;
  _user: ObjectId;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    _user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: 'asc',
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'closed'],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    closedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema, 'Tickets');

export default Ticket;
