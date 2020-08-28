import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  cVSFileName: string;
}

interface Array {
  title: string;
  value: string;
  type: string;
  category: string;
}

class ImportTransactionsService {
  async execute({ cVSFileName }: Request): Promise<Transaction[]> {
    const csvFilePath = path.resolve(uploadConfig.directory, cVSFileName);

    const readCSVStream = fs.createReadStream(csvFilePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const cSVTransactions = [];

    parseCSV.on('data', line => {
      cSVTransactions.push(line);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    const createTransaction = new CreateTransactionService();

    const objectsArray = cSVTransactions.map(item => {
      const transaction = {
        title: item[0],
        value: item[2],
        type: item[1],
        category: item[3],
      };
      return transaction;
    });

    const transactions = [];

    async function createTransactions(transaction) {
      const transactionCreated = await createTransaction.execute({
        title: transaction.title,
        value: transaction.value,
        type: transaction.type,
        category: transaction.category,
      });
      transactions.push(transactionCreated);
    }

    createTransactions(objectsArray[0]);
    createTransactions(objectsArray[1]);
    createTransactions(objectsArray[3]);

    return transactions;
  }
}

export default ImportTransactionsService;
