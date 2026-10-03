const productTypeCoefficients = {
  1: 1.1,
  2: 2.5,
  3: 8.43,
  4: 5.15,
};

const materialDefectPercents = {
  1: 0.1,
  2: 0.95,
  3: 0.28,
  4: 0.55,
  5: 0.34,
};

export function calculateMaterial(productTypeId, materialTypeId, quantity, param1, param2) {
  const coefficient = productTypeCoefficients[productTypeId];
  const defectPercent = materialDefectPercents[materialTypeId];
  if (coefficient === undefined || defectPercent === undefined) {
    return -1;
  }
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return -1;
  }
  if (!(param1 > 0) || !(param2 > 0)) {
    return -1;
  }

  const basePerUnit = param1 * param2 * coefficient;
  const netTotal = basePerUnit * quantity;
  const total = netTotal * (1 + defectPercent / 100);
  if (!Number.isFinite(total)) {
    return -1;
  }
  return Math.ceil(Number(total.toFixed(6)));
}
