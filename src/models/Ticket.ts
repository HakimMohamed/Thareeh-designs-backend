import mongoose, { ObjectId, Schema } from 'mongoose';

export interface ITicket extends Document {
  _id: ObjectId;
  user: {
    _id: ObjectId;
    email: string;
    name: {
      first: string;
      last: string;
    };
  };
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
    user: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: 'asc',
      },
      email: {
        type: String,
        required: true,
        trim: true,
        index: 'asc',
      },
      name: {
        first: {
          type: String,
          required: true,
          trim: true,
        },
        last: {
          type: String,
          required: true,
          trim: true,
        },
      },
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
