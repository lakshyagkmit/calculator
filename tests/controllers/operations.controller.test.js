const operationsController = require('../../src/controllers/operations.controller');
const operationsService = require('../../src/services/operations.service');
const validateEmail = require('../../src/validators/email.validate');

jest.mock('../../src/services/operations.service');
jest.mock('../../src/validators/email.validate');

describe('Operations Controller', () => {
  describe('performCalculation', () => {
    it('should return 400 if input is invalid', async () => {
      const req = { body: { email: '', operands: [], operator: '' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await operationsController.performCalculation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid input' });
    });

    it('should return 422 if email is invalid', async () => {
      const req = { body: { email: 'user@', operands: [1, 2], operator: '+' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      validateEmail.mockReturnValue(false);

      await operationsController.performCalculation(req, res);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email format' });
    });

    it('should return 422 if operands are not valid', async () => {
      const req = { body: { email: 'user@example.com', operands: [1, '45'], operator: '+' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      validateEmail.mockReturnValue(true)

      await operationsController.performCalculation(req, res);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({ message: 'All operands must be valid numbers' });
    });

    it('should return 422 if operands length is less than 2', async () => {
      const req = { body: { email: 'user@example.com', operands: [1], operator: '+' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      validateEmail.mockReturnValue(true)

      await operationsController.performCalculation(req, res);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({ message: 'Atlest two operands are required' });
    });

    it('should return the calculation result on valid input', async () => {
      const req = { body: { email: 'user@example.com', operands: [1, 2], operator: '+' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      validateEmail.mockReturnValue(true);
      operationsService.performCalculation.mockResolvedValue(42);

      await operationsController.performCalculation(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ result: 42 });
    });
  });

  describe('getHistory', () => {
    it('should return 400 if email is not provided', async () => {
      const req = { headers: { email: '' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await operationsController.getHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email is required' });
    });

    it('should return 422 if email is invalid', async () => {
      const req = { headers: { email: 'user@' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      validateEmail.mockReturnValue(false);

      await operationsController.getHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email format' });
    });

    it('should return 404 if no history is found', async () => {
      const req = { headers: { email: 'user@example.com' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      validateEmail.mockReturnValue(true);
      operationsService.getHistory.mockResolvedValue([]);

      await operationsController.getHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No history found for the user' });
    });

    it('should return history if found', async () => {
      const req = { headers: { email: 'user@example.com' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      validateEmail.mockReturnValue(true);
      const mockHistory = [
        { email: 'test@example.com', operands: [1, 2], operator: '+', result: 3 },
      ];
      operationsService.getHistory.mockResolvedValue(mockHistory);

      await operationsController.getHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockHistory);
    });
  });

  describe('clearHistoryRecord', () => {
    it('should return 400 if email is not provided', async () => {
      const req = { headers: { email: '' }, params: { id: '12345' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await operationsController.clearHistoryRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email required' });
    });

    it('should return 422 if email is invalid', async () => {
      const req = { headers: { email: 'user@' }, params: { id: '12345' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      validateEmail.mockReturnValue(false);

      await operationsController.clearHistoryRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email format' });
    });

    it('should return 400 if id is not provided', async () => {
      const req = { headers: { email: 'user@example.com' }, params: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      validateEmail.mockReturnValue(true);

      await operationsController.clearHistoryRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Id required' });
    });

    it('should delete the history record and return 204', async () => {
      const req = { headers: { email: 'user@example.com' }, params: { id: '12345' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      validateEmail.mockReturnValue(true);
      operationsService.clearHistoryRecord.mockResolvedValue(true);

      await operationsController.clearHistoryRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).not.toHaveBeenCalled(); 
    });
  });

  describe('resetHistory', () => {
    it('should return 400 if email is not provided', async () => {
      const req = { headers: { email: '' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await operationsController.resetHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email required' });
    });

    it('should return 422 if email is invalid', async () => {
      const req = { headers: { email: 'user@' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      validateEmail.mockReturnValue(false);

      await operationsController.resetHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email format' });
    });

    it('should reset the history and return 204', async () => {
      const req = { headers: { email: 'user@example.com' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      validateEmail.mockReturnValue(true);
      operationsService.resetHistory.mockResolvedValue(true);

      await operationsController.resetHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).not.toHaveBeenCalled(); 
    });
  });
});
