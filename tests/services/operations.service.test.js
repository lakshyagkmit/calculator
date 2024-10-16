const { performCalculation, getHistory, clearHistoryRecord, resetHistory } = require('../../src/services/operations.service');
const Operation = require('../../src/models/operations.model');

jest.mock('../../src/models/operations.model'); 

describe('Operation Service Functions', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('performCalculation', () => {
    it('should calculate the sum of operands, save to DB, and return the result', async () => {
      const email = 'user@example.com';
      const operands = [5, 10];
      const operator = '+';
      const mockSave = jest.fn().mockResolvedValue();

      Operation.mockImplementation(() => ({ save: mockSave }));

      const result = await performCalculation(email, operands, operator);

      expect(result).toBe(15); 
      expect(Operation).toHaveBeenCalledWith({
        email: email,
        operands: operands,
        result: result,
        operator: operator,
      });
      expect(mockSave).toHaveBeenCalled();
    });

    it('should calculate the subtract of operands, save to DB, and return the result', async () => {
      const email = 'user@example.com';
      const operands = [10, 5];
      const operator = '-';
      const mockSave = jest.fn().mockResolvedValue();

      Operation.mockImplementation(() => ({ save: mockSave }));

      const result = await performCalculation(email, operands, operator);

      expect(result).toBe(5); 
      expect(Operation).toHaveBeenCalledWith({
        email: email,
        operands: operands,
        result: result,
        operator: operator,
      });
      expect(mockSave).toHaveBeenCalled();
    });

    it('should calculate the multiplication of operands, save to DB, and return the result', async () => {
      const email = 'user@example.com';
      const operands = [5, 10];
      const operator = '*';
      const mockSave = jest.fn().mockResolvedValue();

      Operation.mockImplementation(() => ({ save: mockSave }));

      const result = await performCalculation(email, operands, operator);

      expect(result).toBe(50); 
      expect(Operation).toHaveBeenCalledWith({
        email: email,
        operands: operands,
        result: result,
        operator: operator,
      });
      expect(mockSave).toHaveBeenCalled();
    });

    it('should calculate the division of operands, save to DB, and return the result', async () => {
      const email = 'user@example.com';
      const operands = [10, 5];
      const operator = '/';
      const mockSave = jest.fn().mockResolvedValue();

      Operation.mockImplementation(() => ({ save: mockSave }));

      const result = await performCalculation(email, operands, operator);

      expect(result).toBe(2); 
      expect(Operation).toHaveBeenCalledWith({
        email: email,
        operands: operands,
        result: result,
        operator: operator,
      });
      expect(mockSave).toHaveBeenCalled();
    });

    it('should throw an error for division by zero', async () => {
      const email = 'user@example.com';
      const operands = [10, 0];
      const operator = '/';

      await expect(performCalculation(email, operands, operator)).rejects.toThrow('Division by zero is not allowed');
    });

    it('should throw an error for invalid operator', async () => {
      const email = 'user@example.com';
      const operands = [5, 10];
      const operator = '^'; 
      await expect(performCalculation(email, operands, operator)).rejects.toThrow('Invalid operator');
    });
  });

  describe('getHistory', () => {
  it(`should return the user's calculation history`, async () => {
    const email = 'user@example.com';
    const mockHistory = [
      { email, operands: [5, 10], operator: '+', result: 15, createdAt: new Date() },
    ];


    const sortMock = jest.fn().mockResolvedValue(mockHistory);
    Operation.find.mockReturnValue({ sort: sortMock }); 

    const history = await getHistory(email);

    expect(Operation.find).toHaveBeenCalledWith({ email, isDeleted: false });
    expect(sortMock).toHaveBeenCalledWith({ 'createdAt': -1 });
    expect(history).toEqual(mockHistory);
  });
});


  describe('clearHistoryRecord', () => {
    it('should mark a single history record as deleted', async () => {
      const email = 'user@example.com';
      const id = 'some-record-id';
      const mockHistoryRecord = { save: jest.fn(), isDeleted: false };

      Operation.findOne.mockResolvedValue(mockHistoryRecord);

      const result = await clearHistoryRecord(email, id);

      expect(Operation.findOne).toHaveBeenCalledWith({ email, _id: id });
      expect(mockHistoryRecord.isDeleted).toBe(true); 
      expect(mockHistoryRecord.save).toHaveBeenCalled(); 
      expect(result).toEqual(mockHistoryRecord);
    });

    it('should throw an error if no history record is found', async () => {
      const email = 'user@example.com';
      const id = 'non-existent-id';

      Operation.findOne.mockResolvedValue(null); 

      await expect(clearHistoryRecord(email, id)).rejects.toThrow('No history found to delete');
    });
  });

  describe('resetHistory', () => {
    it('should mark all user history as deleted', async () => {
      const email = 'user@example.com';
      const mockHistory = [
        { isDeleted: false, save: jest.fn() },
        { isDeleted: false, save: jest.fn() },
      ];

      Operation.find.mockResolvedValue(mockHistory); 

      await resetHistory(email);

      expect(Operation.find).toHaveBeenCalledWith({ email });
      mockHistory.forEach(record => {
        expect(record.isDeleted).toBe(true); 
        expect(record.save).toHaveBeenCalled(); 
      });
    });

    it('should throw an error if no history is found to reset', async () => {
      const email = 'user@example.com';

      Operation.find.mockResolvedValue([]); 

      await expect(resetHistory(email)).rejects.toThrow('No history found to delete');
    });
  });
});
