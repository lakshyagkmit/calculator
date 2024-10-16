const validateEmail = require('../../src/validators/email.validate'); 

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
