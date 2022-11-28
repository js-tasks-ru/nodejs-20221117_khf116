function sum(a, b) {
  if (isNaN(a) || typeof a !== 'number')
    throw new TypeError('parameter "a" not a number');

  if (isNaN(b) || typeof b !== 'number')
    throw new TypeError('parameter "b" not a number');

  return a + b;
}

module.exports = sum;
