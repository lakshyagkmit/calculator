const redisClient = require('../config/database.js');

// Helper to generate a unique operation ID
const generateOperationId = async () => {
  const operationId = await redisClient.incr('operation:id');
  return `operation:${operationId}`;
};

// Function to perform calculation, save to Redis, and return result
const performCalculation = async (email, operands, operator) => {
  let result;

  try {
    // Convert operands to numbers
    operands = operands.map((operand) => {
      const num = Number(operand);
      if (isNaN(num)) throw new Error(`Invalid operand type: All operands must be numbers, got ${operand}`);
      return num;
    });

    // Perform calculation
    console.log(`Operands after conversion: ${JSON.stringify(operands)}`);
    switch (operator) {
      case '+':
        result = operands.reduce((acc, curr) => acc + curr, 0);
        break;
      case '-':
        result = operands.reduce((acc, curr) => acc - curr);
        break;
      case '*':
        result = operands.reduce((acc, curr) => acc * curr, 1);
        break;
      case '/':
        result = operands.reduce((acc, curr) => {
          if (curr === 0) throw new Error('Division by zero is not allowed');
          return acc / curr;
        });
        break;
      default:
        throw new Error(`Invalid operator: ${operator}`);
    }

    console.log(`Result of calculation: ${result}`);

    // Re-enable Redis with enhanced logging
    const operationId = await generateOperationId();
    console.log(`Generated operation ID: ${operationId}`);

    console.log(`Saving operation to Redis with ID ${operationId}`);
    await redisClient.hSet(operationId, {
      email,
      operands: JSON.stringify(operands),
      operator,
      result: result.toString(),
      isDeleted: 'false',
      createdAt: new Date().toISOString(),
    });
    console.log(`Operation saved to Redis with ID ${operationId}`);

    // Add to history
    console.log(`Adding operation ID ${operationId} to user history list`);
    await redisClient.lPush(`history:${email}`, operationId);
    console.log(`Operation ID ${operationId} added to history`);

    return result;

  } catch (error) {
    console.error('Error performing calculation:', error.message);
    throw new Error(error.message);
  }
};

// Retrieve user's calculation history
const getHistory = async (email) => {
  const operationIds = await redisClient.lRange(`history:${email}`, 0, -1);
  const operations = [];

  for (const operationId of operationIds) {
    const operationData = await redisClient.hGetAll(operationId);
    if (operationData.isDeleted === 'false') {
      operationData.operands = JSON.parse(operationData.operands);
      operations.push({ id: operationId, ...operationData });
    }
  }

  operations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return operations;
};


module.exports = {
  performCalculation,
  getHistory,
};
