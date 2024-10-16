const request = require('supertest');
const express = require('express');
const operationsRoutes = require('../../src/routes/operations.route');

const app = express();
app.use(express.json()); 
app.use('/api/operations', operationsRoutes);

jest.mock('../../src/controllers/operations.controller', () => ({
  performCalculation: jest.fn(),
  getHistory: jest.fn(),
  clearHistoryRecord: jest.fn(),
  resetHistory: jest.fn(),
}));

const {
  performCalculation,
  getHistory,
  clearHistoryRecord,
  resetHistory,
} = require('../../src/controllers/operations.controller');

describe('Operations Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/operations - Perform Calculation', async () => {
    const mockResponse = { result: 42 }; 
    performCalculation.mockImplementation((req, res) => res.status(201).json(mockResponse));

    const response = await request(app)
      .post('/api/operations')
      .send({
        email: 'test@example.com',
        operands: [10, 32],
        operator: '+',
      });

    expect(performCalculation).toHaveBeenCalled();
    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockResponse);
  }, 10000);

  test('GET /api/operations - Get Calculation History', async () => {
    const mockHistory = [
      { email: 'test@example.com', operands: [10, 32], operator: '+', result: 42 },
    ];
    getHistory.mockImplementation((req, res) => res.status(200).json(mockHistory));

    const response = await request(app)
      .get('/api/operations')
      .set('email', 'test@example.com');

    expect(getHistory).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockHistory);
  }, 10000); 

  test('DELETE /api/operations/:id - Clear History Record', async () => {
    clearHistoryRecord.mockImplementation((req, res) => res.status(204).send());

    const response = await request(app)
      .delete('/api/operations/12345')
      .set('email', 'test@example.com');

    expect(clearHistoryRecord).toHaveBeenCalled();
    expect(response.status).toBe(204);
  }, 10000);

  test('DELETE /api/operations/reset - Reset History', async () => {
    resetHistory.mockImplementation((req, res) => res.status(204).send());

    const response = await request(app)
      .delete('/api/operations/reset')
      .set('email', 'test@example.com');

    expect(resetHistory).toHaveBeenCalled();
    expect(response.status).toBe(204);
  }, 10000); 
});
