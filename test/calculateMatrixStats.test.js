const { calculatematrizStats } = require('../index'); // Ajusta la ruta si es necesario

describe('calculatematrizStats', () => {

  test('debería calcular correctamente las estadísticas de una matriz', () => {
    const matriz = [
      [1, 0, 0],
      [0, 2, 0],
      [0, 0, 3],
    ];
    const result = calculatematrizStats(matriz);
    expect(result).toEqual({
      max: 3,
      min: 0,
      sum: 6,
      average: 0.6666666666666666,
      isDiagonal: true,
    });
  });

  test('debería identificar una matriz no diagonal', () => {
    const matriz = [
      [1, 1, 0],
      [0, 2, 0],
      [0, 0, 3],
    ];
    const result = calculatematrizStats(matriz);
    expect(result.isDiagonal).toBe(false);
  });

});