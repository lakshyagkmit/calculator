const mongoose = require('mongoose');
const Operation = require('../../src/models/operations.model'); 
require('dotenv').config(); 


beforeAll(async () => {
  const url = process.env.MONGODB_URL; 
  await mongoose.connect(url);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase(); 
  await mongoose.connection.close();
});

describe('Operation Model', () => {
  it('should create a valid operation', async () => {
    const operation = new Operation({
      email: 'user@example.com',
      operands: [5, 10],
      operator: '+',
      result: 15
    });

    const savedOperation = await operation.save();
    expect(savedOperation._id).toBeDefined();
    expect(savedOperation.email).toBe('user@example.com');
    expect(savedOperation.operands).toEqual([5, 10]);
    expect(savedOperation.operator).toBe('+');
    expect(savedOperation.result).toBe(15);
    expect(savedOperation.isDeleted).toBe(false); 
    expect(savedOperation.createdAt).toBeDefined(); 
  });

  it('should throw validation error if required fields are missing', async () => {
    const operation = new Operation({
      operands: [5, 10],
      operator: '+'
    });

    let err;
    try {
      await operation.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
  });


  it('should throw validation error if operator is missing', async () => {
    const operation = new Operation({
      email: 'user@example.com',
      operands: [5, 10],
      result: 15
    });

    let err;
    try {
      await operation.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.operator).toBeDefined();
  });
});
