import { Router, Request, Response } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';

const transactionRouter = Router();

const transactionsRepository = new TransactionsRepository();

const createTranscationService = new CreateTransactionService(
  transactionsRepository,
);

transactionRouter.get('/', (request, response) => {
  try {
    return response.json(transactionsRepository.all());
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', (request: Request, response: Response) => {
  try {
    const transcation = createTranscationService.execute(request.body);
    return response.json(transcation);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
