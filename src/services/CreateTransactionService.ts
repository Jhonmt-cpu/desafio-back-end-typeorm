import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

import ValidateCategoryService from './ValidateCategoryService';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && total - value < 0) {
      throw new AppError('Your balance is insuficient for the transaction!');
    }

    const validateCategoryService = new ValidateCategoryService();

    const category_id = (
      await validateCategoryService.execute({ category })
    ).toString();

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
