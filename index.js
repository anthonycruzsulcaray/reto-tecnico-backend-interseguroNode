const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const app = express();
require('dotenv').config();

console.log('NODE_ENV_TEST:', process.env.NODE_ENV_TEST); // prod / test
console.log('PORT:', process.env.PORT);

app.use(cors());
app.use(bodyParser.json());

/**
 * Verifica si una matriz es diagonal.
 * Una matriz es diagonal si todos los elementos fuera de la diagonal principal son ceros.
 * 
 * @param {number[][]} matriz - La matriz a verificar.
 * @returns {boolean} - `true` si la matriz es diagonal, de lo contrario, `false`.
 */
const isDiagonalmatriz = (matriz) => {
    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            if (i !== j && matriz[i][j] !== 0) {
                return false;
            }
        }
    }
    return true;
};

/**
 * Calcula estadísticas básicas de una matriz.
 * Las estadísticas incluyen el valor máximo, el valor mínimo, la suma total, el promedio
 * y si la matriz es diagonal.
 * 
 * @param {number[][]} matriz - La matriz de entrada.
 * @returns {Object} - Un objeto con las estadísticas calculadas:
 *   - `max`: El valor máximo.
 *   - `min`: El valor mínimo.
 *   - `sum`: La suma total de los elementos.
 *   - `average`: El promedio de los elementos.
 *   - `isDiagonal`: `true` si la matriz es diagonal, de lo contrario, `false`.
 */
const calculatematrizStats = (matriz) => {
    let max = Number.NEGATIVE_INFINITY; // Inicializar con el valor más bajo posible
    let min = Number.POSITIVE_INFINITY; // Inicializar con el valor más alto posible
    let sum = 0; // Inicializar suma en 0
    let count = 0; // Contador de elementos

    for (let row of matriz) {
        for (let value of row) {
            max = Math.max(max, value);
            min = Math.min(min, value);
            sum += value;
            count++;
        }
    }

    const average = sum / count;
    const isDiagonal = isDiagonalmatriz(matriz);

    return { max, min, sum, average, isDiagonal };
};

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Análisis de Matrices',
            version: '1.0.0',
            description: 'Esta API analiza matrices y calcula estadísticas básicas.',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./index.js'], // Archivos donde están los comentarios Swagger
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * components:
 *   schemas:
 *     matriz:
 *       type: array
 *       items:
 *         type: array
 *         items:
 *           type: number
 *     matrizStats:
 *       type: object
 *       properties:
 *         max:
 *           type: number
 *         min:
 *           type: number
 *         sum:
 *           type: number
 *         average:
 *           type: number
 *         isDiagonal:
 *           type: boolean
 * 
 * /analyze:
 *   post:
 *     summary: Analiza matrices y calcula estadísticas.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rotated:
 *                 $ref: '#/components/schemas/matriz'
 *               Q:
 *                 $ref: '#/components/schemas/matriz'
 *               R:
 *                 $ref: '#/components/schemas/matriz'
 *     responses:
 *       200:
 *         description: Estadísticas calculadas y matrices.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Rotatedmatriz:
 *                   $ref: '#/components/schemas/matriz'
 *                 QStats:
 *                   $ref: '#/components/schemas/matrizStats'
 *                 RStats:
 *                   $ref: '#/components/schemas/matrizStats'
 *                 Qmatriz:
 *                   $ref: '#/components/schemas/matriz'
 *                 Rmatriz:
 *                   $ref: '#/components/schemas/matriz'
 *       400:
 *         description: Faltan las matrices Q y/o R en el cuerpo de la solicitud.
 */

app.post('/analyze', (req, res) => {
    const { rotated, Q, R } = req.body;

    if (!Q || !R) {
        return res.status(400).json({ error: "Faltan las matrices Q y/o R en el cuerpo de la solicitud" });
    }

    const statsQ = calculatematrizStats(Q);
    const statsR = calculatematrizStats(R);

    res.json({
        Rotatedmatriz: rotated,
        QStats: statsQ,
        RStats: statsR,
        Qmatriz: Q,
        Rmatriz: R,
    });
});

if (process.env.NODE_ENV_TEST == "prod") {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor Express => http://localhost:${PORT}`);
        console.log(`Documentación Swagger => http://localhost:${PORT}/api-docs`);
    });
}

module.exports = { calculatematrizStats };