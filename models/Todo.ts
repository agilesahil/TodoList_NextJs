import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ITodo extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  completed: boolean;
  showOnFront: boolean;
  createdAt: Date;
}

const TodoSchema = new Schema<ITodo>(
  {
    title: {
      type: String,
      required: [true, 'Todo title is required'],
      trim: true,
      maxlength: [500, 'Todo title cannot exceed 500 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    showOnFront: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // We're manually managing createdAt
  }
);

// Prevent model re-compilation during hot reloads in development
const Todo: Model<ITodo> =
  mongoose.models.Todo || mongoose.model<ITodo>('Todo', TodoSchema);

export default Todo;
