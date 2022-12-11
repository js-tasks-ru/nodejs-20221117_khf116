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

      errors = validator.validate({ name: 'Lalalalalalalalalalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 22');

      errors = validator.validate({ name: 'Lalalalalala' });

      expect(errors).to.be.empty;
    });

it('валидатор проверяет числовые поля', () => {
  const validator = new Validator({
    age: {
      type: 'number',
      min: 10,
      max: 20,
    },
  });

  let errors = validator.validate({ age: 4 });

  expect(errors).to.have.length(1);
  expect(errors[0]).to.have.property('field').and.to.be.equal('age');
  expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 10, got 4');

  errors = validator.validate({ age: 30 });

  expect(errors).to.have.length(1);
  expect(errors[0]).to.have.property('field').and.to.be.equal('age');
  expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 20, got 30');

  errors = validator.validate({ age: 12 });

  expect(errors).to.be.empty;
});

it('валидатор проверяет несколько полей', () => {
  const validator = new Validator({
    name: {
      type: 'string',
      min: 10,
      max: 20,
    },
    age: {
      type: 'number',
      min: 10,
      max: 20,
    },
  });

  let errors = validator.validate({ name: 10, age: 'Lalala' });

  expect(errors).to.have.length(2);

  expect(errors[0]).to.have.property('field').and.to.be.equal('name');
  expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');

  expect(errors[1]).to.have.property('field').and.to.be.equal('age');
  expect(errors[1]).to.have.property('error').and.to.be.equal('expect number, got string');
});
  });
});