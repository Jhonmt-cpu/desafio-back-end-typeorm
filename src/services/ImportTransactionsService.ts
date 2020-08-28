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
  /* async execute({ cVSFileName }: Request): Promise<Transaction[]> {
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
  } */
}

export default ImportTransactionsService;
