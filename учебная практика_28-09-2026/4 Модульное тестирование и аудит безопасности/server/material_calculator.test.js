import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateMaterial } from './material_calculator.js';

test('стандартный расчет', () => {
  assert.equal(calculateMaterial(2, 1, 1000, 2, 2), 10010);
});

test('дробный результат округляется вверх', () => {
  assert.equal(calculateMaterial(1, 1, 10, 2, 3), 67);
});

test('несуществующий тип продукции или материала', () => {
  assert.equal(calculateMaterial(99, 1, 10, 2, 3), -1);
  assert.equal(calculateMaterial(1, 99, 10, 2, 3), -1);
});

test('отрицательные параметры', () => {
  assert.equal(calculateMaterial(1, 1, 10, -2, 3), -1);
  assert.equal(calculateMaterial(1, 1, 10, 2, -3), -1);
});

test('нулевое и отрицательное количество', () => {
  assert.equal(calculateMaterial(1, 1, 0, 2, 3), -1);
  assert.equal(calculateMaterial(1, 1, -5, 2, 3), -1);
});
