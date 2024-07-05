import {submitContactForm} from "../controller/contact.controller.js"
import express from 'express';
import { body } from 'express-validator';



const router = express.Router();

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Email is invalid'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('message').notEmpty().withMessage('Message is required'),
  ],
  submitContactForm
);

export default router;
