const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      let errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');

      errors = validator.validate({ name: 'LalalaLalalaLalalaLalala' });
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 24');
    });

    it('валидатор проверяет числовые поля', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      });

      let errors = validator.validate({ age: 15 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 18, got 15');

      errors = validator.validate({ age: 28 });
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 27, got 28');
    });

    it('валидатор проверяет на тип данных', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      });

      const errors = validator.validate(
        { name: 123, age: '123' }
      );

      expect(errors).to.have.length(2);
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
      expect(errors[1]).to.have.property('error').and.to.be.equal('expect number, got string');
    });

    it('валидатор работает', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      });

      const errors = validator.validate(
        { name: '1234567890', age: 18 }
      );

      expect(errors).to.have.length(0);
    });

    it('передан объект с несуществующем полем', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate(
        { name1: '1234567890' }
      );

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('error').and.to.be.equal('field is undefined');
    });
  });
});