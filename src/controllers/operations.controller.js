const operationsService = require('../services/operations.service');
const validateEmail = require('../validators/email.validate');

// function which calculates and returns result
const performCalculation = async (req, res) => {
  try {
    const { email, operands, operator } = req.body;

    if (!email|| !operands || !Array.isArray(operands) || !operator) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    if (!validateEmail(email)) {
      return res.status(422).json({ message: 'Invalid email format' });
    }

    if (operands.length < 2){
    	return res.status(422).json({message: 'Atlest two operands are required'});
    }

    const invalidOperands = operands.some(op => typeof op !== 'number');
    if (invalidOperands) {
      return res.status(422).json({ message: 'All operands must be valid numbers' });
    }

    const result = await operationsService.performCalculation(email, operands, operator);

    res.status(201).json({ result });
  } catch (err) {
    console.log(err.message);
    return res.status(422).json({ message: `${err.message}` });
  }
};

// function to get history
const getHistory = async (req, res) => {
  try {
    const email = req.headers.email;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (!validateEmail(email)) {
      return res.status(422).json({ message: 'Invalid email format' });
    }

    const history = await operationsService.getHistory(email);

    if (history.length === 0) {
      return res.status(404).json({ message: 'No history found for the user' });
    }

    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching history:', error.message);
    return res.status(400).json({ message: 'Something went wrong!' });
  }
};

// function to delete a history
const clearHistoryRecord = async (req, res) => {
  try {
    const email = req.headers.email;
    const { id } = req.params;
    
    if (!email) {
      return res.status(400).json({message: 'Email required' });
    }

    if (!validateEmail(email)) {
      return res.status(422).json({ message: 'Invalid email format' });
    }

    if(!id){
    	return res.status(400).json({message: 'Id required' });
    }

    const history = await operationsService.clearHistoryRecord(email, id);

    return res.status(204);
  } catch (err) {
  	console.log(err.message);
    return res.status(404).json({message: `${err.message}`,});
  }
};


// Function to reset the history
const resetHistory = async (req, res) => {
  try {
    const email = req.headers.email;

    if (!email) {
      return res.status(400).json({message: "Email required" });
    }

    if (!validateEmail(email)) {
      return res.status(422).json({ message: 'Invalid email format' });
    }

    const history = await operationsService.resetHistory(email);

    return res.status(204);
  } catch (err) {
  	console.log(err.message);
    return res.status(400).json({message: "Couldn't reset user's history",});
  }
};

module.exports = {
	performCalculation,
	getHistory,
	clearHistoryRecord,
	resetHistory
};
