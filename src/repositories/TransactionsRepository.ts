import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDto {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface TransactionsResume {
  transactions: Transaction[];
  balance: Balance;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  private calcBalance(): Balance {
    return this.transactions.reduce(
      (a, b) => {
        const result = {
          income: b.type === 'income' ? a.income + b.value : a.income + 0,
          outcome: b.type === 'outcome' ? a.outcome + b.value : a.outcome + 0,
          total: a.income - b.value,
        };
        result.total = result.income - result.outcome;
        return result;
      },
      { income: 0, outcome: 0, total: 0 },
    );
  }

  public all(): TransactionsResume {
    return {
      transactions: this.transactions,
      balance: this.calcBalance(),
    };
  }

  public getBalance(): Balance {
    return this.calcBalance();
  }

  public create({ title, value, type }: TransactionDto): Transaction {
    const balance = this.getBalance();

    if (balance.total < value && type === 'outcome') {
      throw Error('No funds');
    }

    const transaction = new Transaction({ title, value, type });
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
