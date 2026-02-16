/**
 * Central database layer: connection + schema (models & types).
 * Import from here for all DB access.
 */

export { default as connectDB } from '@/lib/mongodb';

export { default as Todo, type ITodo } from '@/models/Todo';
export { default as Contact, type IContact } from '@/models/Contact';
