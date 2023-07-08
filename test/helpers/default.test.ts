import { expect } from 'chai';

import BuiltInHelpers from '../../src/helpers/default';

describe('Built In Helpers', () => {
  describe('uppercase', () => {
    it('should return an uppercase string', () => {
      const text = 'hello world';
      const result = BuiltInHelpers.uppercase(text);
      expect(result).to.equal('HELLO WORLD');
    });

    it('should return an empty string for null or undefined input', () => {
      const nullResult = BuiltInHelpers.uppercase(null);
      expect(nullResult).to.equal('');

      const undefinedResult = BuiltInHelpers.uppercase(undefined);
      expect(undefinedResult).to.equal('');
    });
  });

  describe('lowercase', () => {
    it('should return a lowercase string', () => {
      const text = 'Hello World';
      const result = BuiltInHelpers.lowercase(text);
      expect(result).to.equal('hello world');
    });

    it('should return an empty string for null or undefined input', () => {
      const nullResult = BuiltInHelpers.lowercase(null);
      expect(nullResult).to.equal('');

      const undefinedResult = BuiltInHelpers.lowercase(undefined);
      expect(undefinedResult).to.equal('');
    });
  });

  describe('isFieldRelated', () => {
    it('should return true when field is related to the object', () => {
      const object = 'user';
      const field = 'user.name';
      const result = BuiltInHelpers.isFieldRelated(object, field);
      expect(result).to.be.true;
    });

    it('should return false when field is not related to the object', () => {
      const object = 'user';
      const field = 'product.name';
      const result = BuiltInHelpers.isFieldRelated(object, field);
      expect(result).to.be.false;
    });
  });
});
