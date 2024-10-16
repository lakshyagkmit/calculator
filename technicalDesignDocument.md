# Basic Calculator Design Document
Author: Lakshya Kumar Singh


## Introduction

The goal of this document is to design a basic calculator application with essential functions (addition, subtraction, multiplication, and division) while also incorporating user-based history. The calculator will store the user's calculation history based on their email, allowing users to retrieve their previous calculations.

## Background

The application will behave similarly to a standard handheld calculator. It is intended to be intuitive for users who are familiar with basic calculators, but with the added functionality of saving and retrieving the calculation history per user using their email.
Users will be able to:
Perform basic arithmetic operations (addition, subtraction, multiplication, division).
View their calculation history by entering their email.


## Features

### In Scope

**Core Calculator Functionality:**
- Addition (+)
- Subtraction (-)
- Multiplication (×)
- Division (÷)
- Clear/reset functionality

**User-Based History:**
- Save Calculation History: Each calculation will be saved using the user's email as an identifier.
- Retrieve Calculation History: The user can view their past calculations by providing their email.

### Out of Scope
- Authentication system (e.g., password-based login).
- Advanced calculator functionalities (e.g., square roots, exponentiation).
- User Interface (UI) design for the application. Only backend and logic design are covered.

## Requirements

### Functional Requirements

**Perform Arithmetic Operations:**
- The user should be able to input two numbers and an operator (+, -, ×, ÷).
- The system should return the result of the operation immediately.
- Division by zero should return an appropriate error message.
Store Calculation History:
- After every calculation, the result should be saved in a database with the associated user’s email and the details of the calculation (operands, operation, result, and timestamp).

**Retrieve Calculation History:**
- Users should be able to view their past calculations based on their email.
- The system should return the list of previous operations with details like the operands, operation, result, and timestamp.

**Clear/Reset Functionality:**
- The system should provide a "clear" function to reset the input fields and result.

**Input Validation:**
- The system should ensure that inputs are valid numbers and operators are one of the supported arithmetic operators (+, -, ×, ÷).
- Invalid inputs should return error messages.

### Non-Functional Requirements

- **Performance:**
The system should handle multiple user requests and calculations simultaneously without delays.
The calculation results should be returned in real-time (low latency).

### Technical Requirements
- **Backend:** Node.js(with Express).
- **Database:** MongoDB for storing the history of a user based on email.
- **Testing:** Jest for testing the server.


## Proposal

The solution will consist of a basic backend service that performs arithmetic operations, stores user-specific calculation history in a database, and retrieves the history based on user email input.
The system will implement basic input validation and error handling for operations like division by zero or invalid inputs. Users will be able to interact with the system by providing inputs (two numbers and an operator) and their email to view their history.

### Data Model

The application will use a simple data model to store user history and operations.

### Schema Definition:

**User_Calculation_History:**
- id: Unique identifier for each calculation entry.
- email: The email address provided by the user (used as an identifier).
- operands: array of operands
- operation: Type of operation (addition, subtraction, multiplication, division).
- result: Result of the operation.
- timestamp: The exact time when the operation was performed.


### Validation:
- Ensure that the email is in a valid format.
- Operand values must be numeric.
- Operation must be one of the allowed types: +, -, ×, ÷.

### API/Interface Changes

The application will expose the following APIs for interaction.

**REST Endpoints:**

**API Endpoint for Calculate:**
- Endpoint: /operations
- Method: POST
- Payload:
- "+”
```json
{
  "email": user@example.com,
  "input1": 10,
  "input2": 20,
  "operator": "+",
}
```
- “-”
```json
{
  "email": user@example.com,
  "input1": 20,
  "input2": 10,
  "operator": "-",
}
```

- “*”
```json
{
  "email": user@example.com,
  "input1": 10,
  "input2": 20,
  "operator": "*",
}
```

- “/”
```json
{
  "email": user@example.com,
  "input1": 20,
  "input2": 10,
  "operator": "/",
}
```

- Response:
- result: Result of the calculation.
In case of an error (e.g., division by zero), return an appropriate error message.

- “+”
```json
{
"output": 30
}
```


- “-”
```json
{
"output": 10
}
```


- “*”
```josn
{
"output": 200
}
```


- “/”
```json
{
"output": 2
}
```



**API Endpoint for History**

- Endpoint: /operations
- Method: GET
- Headers: email
- Response: Return a list of past calculations performed by the user, including operands, operations, results, and timestamps.

```json
[{
"input1": 10,
"input2": 20,
"operator": “+”,
"output": 30,
"timestamp": "14-10-24 6:06pm"
},
{
"input1": 20,
"input2": 10,
"operator": “-”,
"output": 10,
"timestamp": "14-10-24 6:16pm"
},
{
"input1": 10,
"input2": 20,
"operator": “*”,
"output": 200,
"timestamp": "14-10-24 6:06pm"
},
{
"input1": 20,
"input2": 10,
"operator": “/”,
"output": 2,
"timestamp": "14-10-24 6:06pm"
}]
```

- Endpoint: /operations/:id 
- Method: DELETE
- Header: email
- queryParams: id
- Response: Delete single user history

- Endpoint: /operations/reset
- Method: DELETE
- Header: email
- Response: Delete all history of a user


**Error States:**

- Invalid input: If the user enters invalid numbers or an unsupported operation, the system should return a "400 Bad Request" response with an error message.
- Division by zero: Return an error response indicating that division by zero is not allowed.


###System Design

**A potential system diagram might include:**
- Frontend/Client (Out of Scope): User interface to input numbers, operations, and view history.
- Calculator Service: Handles the core arithmetic operations and input validation.
- History Service: Handles saving and retrieving calculation history using the email as an identifier.
- Database: Stores the user history and associated data (operation, result, timestamp).

**High-Level Flow:**
- The user inputs two numbers, selects an operator, and enters their email.
- The request is sent to the Calculator Service, which performs the operation.
- The result is returned and saved in the database by the History Service.
- The user can then request to view their history by providing their email, which - is retrieved from the database and displayed.


### Tests
- This section outlines the test cases that will be written to validate the functionality and performance of the calculator application.
Test cases for models 

- Checks if the model creates valid operation
```json
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
```

- Checks for eros if fields are missing
```json
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
```

- Checks for error if operator is missing
```josn
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
```

- Test cases for routes
- Checks for posting data in db through accurate routes
```json
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
```

- Checks for getting data from db through accurate routes
```json 
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
```

- Checks for delete single record from db through accurate routes
```json
 test('DELETE /api/operations/:id - Clear History Record', async () => {
    clearHistoryRecord.mockImplementation((req, res) => res.status(204).send());

    const response = await request(app)
      .delete('/api/operations/12345')
      .set('email', 'test@example.com');

    expect(clearHistoryRecord).toHaveBeenCalled();
    expect(response.status).toBe(204);
  }, 10000);
```

- Checks for deleting history from db through accurate routes
```json
test('DELETE /api/operations - Reset History', async () => {
    resetHistory.mockImplementation((req, res) => res.status(204).send());

    const response = await request(app)
      .delete('/api/operations')
      .set('email', 'test@example.com');

    expect(resetHistory).toHaveBeenCalled();
    expect(response.status).toBe(204);
  }, 10000); 
```

- Test cases for validators 
- Checks if the validate email function works perfectly or not 
```json
describe('Email Validation', () => {
  it('should return true for a valid email format', () => {
    const validEmails = [
      'test@example.com',
      'user.name+tag+sorting@example.com',
      'user.name@example.co.in',
      'user_name@example.org',
      'user-name@example.com'
    ];
    
    validEmails.forEach(email => {
      expect(validateEmail(email)).toBe(true);
    });
  });

  it('should return false for an invalid email format', () => {
    const invalidEmails = [
      'plainaddress',
      '@missingusername.com',
      'username@domain@domain.com',
      'username@domain@.com',
      'user name@domain.com',
      'user@.com'
    ];
    
    invalidEmails.forEach(email => {
      expect(validateEmail(email)).toBe(false);
    });
  });
});
```

- Test cases for services 
- Checks for operations
```json
  it('should calculate the sum of operands, save to DB, and return the result', async () => {
      const email = 'user@example.com';
      const operands = [5, 10];
      const operator = '+';
      const mockSave = jest.fn().mockResolvedValue();

      Operation.mockImplementation(() => ({ save: mockSave }));

      const result = await performCalculation(email, operands, operator);

      expect(result).toBe(15); // 5 + 10 = 15
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

      expect(result).toBe(5); // 5 + 10 = 15
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

      expect(result).toBe(50); // 5 + 10 = 15
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

      expect(result).toBe(2); // 5 + 10 = 15
      expect(Operation).toHaveBeenCalledWith({
        email: email,
        operands: operands,
        result: result,
        operator: operator,
      });
      expect(mockSave).toHaveBeenCalled();
    });
```

- Checks for errors
```json
    it('should throw an error for division by zero', async () => {
      const email = 'user@example.com';
      const operands = [10, 0];
      const operator = '/';

      await expect(performCalculation(email, operands, operator)).rejects.toThrow('Division by zero is not allowed');
    });

    it('should throw an error for invalid operator', async () => {
      const email = 'user@example.com';
      const operands = [5, 10];
      const operator = '^'; // Invalid operator

      await expect(performCalculation(email, operands, operator)).rejects.toThrow('Invalid operator');
    });
  });
```

- Tests for getting history 
```js
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

Tests for clearing single record
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
```


- Tests for reset history
```json
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
```

- Test cases for controllers 
- Tests for performCalculation function
```json
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
```

- Test for getHistory function
```json
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
```

- Tests for clearHistoryRecord function
```json
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
```

- Tests for resetHistory function
```json
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
```

## Conclusion

This document outlines the functional and non-functional requirements for designing a basic calculator application that supports core arithmetic operations and saves the user’s calculation history based on their email. The proposed system design focuses on ensuring simplicity, usability, and performance while considering scalability and security factors.
