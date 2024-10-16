const Operation = require('../models/operations.model');


// function which calculates the result, saves it in db and returns it.
const performCalculation = async (email, operands, operator) => {
  let result;

  operands = operands.map(Number);

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
      throw new Error('Invalid operator');
  }


  const operation = new Operation({
    email: email,
    operands: operands,
    result: result,
    operator: operator
  });

  await operation.save();

  return result;
};


// Retrieve user's calculation history
const getHistory = async (email) => {
  return Operation.find({ email: email, isDeleted: false }).sort( { 'createdAt': -1 } );

};


//clears the user's single history
const clearHistoryRecord = async (email, id) => {
  const history = await Operation.findOne({ email: email, _id: id });

  if (!history) {
    throw new Error('No history found to delete');
  }

  history.isDeleted = true;
  await history.save();

  return history;
};


// resets user's entire history
const resetHistory = async (email) => {
   const history = await Operation.find({ email: email });

    if(history.length === 0) {
      throw new Error('No history found to delete');
    } 

    const deleteUsersHistoryPromises = history.map(async record => {
          record.isDeleted = true;
          return await record.save();
      });

      await Promise.all(deleteUsersHistoryPromises);
};


module.exports = {
  performCalculation,
  getHistory,
  clearHistoryRecord,
  resetHistory
}; 