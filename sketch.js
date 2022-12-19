class Matrix {
  /**
   * Base matrix constructor
   * @param {Number} rows rows of matrix
   * @param {Number} cols columns of matrix
   */
  constructor(rows = 1, cols = 1) {
    this.rows = rows;
    this.cols = cols;
    this.data = [];

    this.init = () => {
      for (let i = 0; i < this.rows; i++) {
        this.data[i] = [];
        for (let j = 0; j < this.cols; j++) {
          this.data[i][j] = 0;
        }
      }
      delete this.init;
    }
    this.init();
  }


  /**
   * Get a value from the matrix
   * @param {Number} row
   * @param {Number} column
   * @returns {Number} Value at row, column
   */
  get(row, column) {
    return this.data[row][column];
  }

  /**
   * Get row of matrix
   * @param {Number} row 
   * @returns {Array} Row of matrix
   */
  getRow(row) {
    return this.data[row];
  }

  /**
   * Get column of matrix
   * @param {Number} col 
   * @returns {Array} Column of matrix
   */
  getCol(col) {
    return this.transpose().data[col];
  }

  /**
   * Set value in matrix
   * @param {Number} row 
   * @param {Number} column 
   * @param {Number} val 
   */
  set(row, column, val) {
    this.data[row][column] = val;
  }

  /**
   * Set value of row in matrix
   * @param {Number} row 
   * @param {Number[]} arr new row
   */
  setRow(row, arr) {
    this.data[row] = arr ;
  }

  /**
   * Set value of column in matrix
   * @param {Number} col 
   * @param {Number[]} arr 
   */
  setCol(col, arr) {
    this.transpose(true);
    this.data[col] = arr;
    this.transpose(true);
  }

  /**
   * Set all values in matrix
   * @param {Number[][]} table  
   */
  setTable(table) {
    this.data = table;
  }

  /**
   * Loop through every value in matrix iterating by row
   * @param {Function} callback Callback function
   */
  forEach(callback) {
    this.data.forEach((row, i) => {
      row.forEach((col, j) => {
        callback(col, i, j);
      })
    })
  }

  /**
   * Transpose matrix
   * @param {Boolean} write Set matrix as transposed matrix
   */
  transpose(write = false) {
    const result = new Matrix(this.cols, this.rows);
    this.forEach((val, i, j) => {
      result.set(j, i, this.get(i, j));
    });
    if (write) { 
      this.data = result.data;
      this.rows = result.rows;
      this.cols = result.cols;
     }
    return result;
  }

  /**
   * Check if matrix size is equal
   * @param {Matrix} matrix 
   * @returns {Boolean} Result of check
   */
  isEqualSize(matrix) {
    if (this.rows == matrix.rows && this.cols == matrix.cols) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Add a number or matrix to this matrix
   * @param {(Number|Matrix)} n 
   * @param {Boolean} write Set matrix as added matrix
   * @returns Modified matrix
   */
  add(n, write = false) {
    const result = new Matrix(this.rows, this.cols);

    this.forEach((val, i, j) => {
      if (n instanceof Matrix) {
        if (!this.isEqualSize(n)) { return; }

        result.set(i, j, val + n.get(i, j));
      } else {
        result.set(i, j, val + n)
      }
    })

    if (write) { this.data = result.data; }
    return result;
  }

  /**
   * Subtract a number or matrix from this matrix
   * @param {(String|Matrix)} n 
   * @param {Boolean} write Set matrix as subtracted matrix
   * @returns Modified matrix
   */
  sub(n, write = false) {
    const result = new Matrix(this.rows, this.cols);

    this.forEach((val, i, j) => {
      if (n instanceof Matrix) {
        if (!this.isEqualSize(n)) { return; }

        result.set(i, j, val - n.get(i, j));
      } else {
        result.set(i, j, val - n)
      }
    });

    if (write) { this.data = result.data; }
    return result;
  }

  /**
   * Multiply a number or matrix to this matrix
   * @param {(Number|Matrix)} n 
   * @param {Boolean} set Set matrix as multiplied matrix 
   * @returns 
   */
  multiply(n, set = false) {
    let result;

    if (n instanceof Matrix) {
      if (this.rows != n.cols) { return; }
      result = new Matrix(this.rows, n.cols);

      this.data.forEach((row, i) => {
        row.forEach((col, j) => {
          result.set(i, j, this.data[i][j] * n.data[i][j]);
        });
      });

    } else {
      result = new Matrix(this.rows, this.cols);

      this.data.forEach((row, i) => {
        row.forEach((col, j) => {
          this.data[i][j] *= n;
        });
      });
    }

  }
}

class TransformationMatrix extends Matrix {
  /**
   * @param {Array} table
   */
  constructor(table) {
    super(3,3);

    this.init = () => {
      table.forEach((row, i) => {
        row.forEach((col, j) => {
          this.set(i, j, col);
        });
      });

      delete this.init;
    }
    this.init();
  }

  /**
   * Get a value from the matrix
   * @param {Number} row
   * @param {Number} column
   * @returns {Number} Value at row, column
   */
  get(row, column) {
    return this.data[row][column]();
  }

  /**
   * Set value in matrix
   * @param {Number} row 
   * @param {Number} column 
   * @param {Number|Function} val 
   */
  set(row, column, val) {
    if (typeof val == "function") {
      this.data[row][column] = val;
    } else {
      this.data[row][column] = () => { return val };
    }
  }

  /**
   * Set all values in matrix
   * @param {Number[][]} table  
   */
  setTable(table) {
    table.forEach((row, i) => {
      row.forEach((col, j) => {
        if (typeof col == "function") {
          this.data[i][j] = col;
        } else {
          this.data[i][j] = () => { return col };
        }
      });
    });
  }
  /**
   * Transform a vector in a matrix
   * @param {Vector3} vector 
   * @returns {Vector3} Transformed Vector
   */
  transform(vector) {
    return new Vector3(
      vector.x * this.get(0, 0) + vector.y * this.get(1, 0) + vector.z * this.get(2, 0),
      vector.x * this.get(0, 1) + vector.y * this.get(1, 1) + vector.z * this.get(2, 1),
      vector.x * this.get(0, 2) + vector.y * this.get(1, 2) + vector.z * this.get(2, 2)

    );
  }
}

class Vector3 extends Matrix {
  /**
   * @param {Number} x X-Coordinate 
   * @param {Number} y Y-Coordinate
   * @param {Number} z Z-Coordinate
   */
  constructor(x = 0, y = 0, z = 0) {
    super(3, 1);
    this.setCol(0, [x, y, z]);
    
  }
  get x() {
    return this.data[0][0]
  }
  get y() {
    return this.data[1][0]
  }
  get z() {
    return this.data[2][0]
  }
  /**
   * (Getter) Magnitude of vector
   */
  get mag() {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }

  /**
   * (Getter) UnitVector of vector
   */
  get unitVector() {
    return new Vector3(this.x / this.mag, this.y / this.mag, this.z / this.mag);
  }
  
  /**
   * Scalar product of two vectors
   * @param  {Vector3} vector
   * @returns {Number} ScalarProduct 
   */
  scalarProduct(vector) {
    const angle = (this.x * vector.x + this.y * vector.y + this.z * vector.z) / (this.mag * vector.mag);
    return angle * this.mag * vector.mag;
  }

  /**
   * Project vector onto another vector
   * @param {Vector3} vector 
   * @returns {Number} Length of projected vector
   */
  projectedSize(vector) {
    return (this.scalarProduct(vector)) / vector.mag;
  }
}

class Camera extends Vector3 {
  constructor(x, y, z) {
    super(x, y, z);
  }
  /**
   * Project onto camera plane
   * @param {Vector3} vector 
   * @returns {Vector3} Projected vector
   */
  toProjected(vector) {
    const projectedLength = vector.projectedSize(this);
    const negativeVector = new Vector3(this.unitVector.x * projectedLength, this.unitVector.y * projectedLength, this.unitVector.z * projectedLength);
    return vector.sub(negativeVector);
    }
  }

/**
 * Create A cube with parameters
 * @param {Number} x X-coordinate
 * @param {Number} y Y-coordinate
 * @param {Number} z Z-coordinate
 * @param {Number} w Width
 * @param {Number} h Height
 * @param {Number} d Depth
 * @returns {Array} Vectors of new cube
 */
const createCube = (x, y, z, w, h, d) => {
  return [
    new Vector3(x, y, z),
    new Vector3(x + w, y, z),
    new Vector3(x, y + h, z),
    new Vector3(x + w, y + h, z),
    new Vector3(x, y, z + d),
    new Vector3(x, y + h, z + d),
    new Vector3(x + w, y, z + d),
    new Vector3(x + w, y + h, z + d)
  ]
}

// Global time variable
let t = 1;

const rotateX = new TransformationMatrix(
  [
    [1, 0, 0],
    [0, () => { return Math.cos(t * Math.PI) }, () => { return -Math.sin(t * Math.PI) }],
    [0, () => { return Math.sin(t * Math.PI) }, () => { return Math.cos(t * Math.PI) }]
  ]
);

const rotateY = new TransformationMatrix(
  [
    [() => { return Math.cos(Math.sqrt(t)) }, 0, () => { return Math.sin(Math.sqrt(t)) }],
    [0, 1, 0],
    [() => { return -Math.sin(Math.sqrt(t)) }, 0, () => { return Math.cos(Math.sqrt(t)) }]
  ]
);

const rotateZ = new TransformationMatrix(
  [
    [() => { return Math.cos(t) }, () => { return -Math.sin(t) }, 0],
    [() => { return Math.sin(t) }, () => { return Math.cos(t) }, 0],
    [0, 0, 1]
  ]
);

const cam1 = new Camera(0, 0, 1);
const testCube = createCube(-50, -50, -50, 100, 100, 100);

setup = () => {
  createCanvas(windowWidth, windowHeight);
}

draw = () => {
  background(255);
  strokeWeight(2);
  line(0, height / 2, width, height / 2);
  line(width / 2, 0, width / 2, height);
  translate(width / 2, height / 2);
  strokeWeight(10);
  t += 0.01;

  const projected = [...testCube]
    .map(vector => { return rotateY.transform(vector) })
    .map(vector => { return rotateZ.transform(vector) })
    .map(vector => { return rotateX.transform(vector) })
    .map(vector => { return cam1.toProjected(vector) });
  projected.forEach(vector => {
    point(vector.data[0][0], vector.data[1][0]);
  });
  strokeWeight(2);
  line(projected[0].data[0][0], projected[0].data[1][0], projected[1].data[0][0], projected[1].data[1][0]);
  line(projected[0].data[0][0], projected[0].data[1][0], projected[2].data[0][0], projected[2].data[1][0]);
  line(projected[0].data[0][0], projected[0].data[1][0], projected[4].data[0][0], projected[4].data[1][0]);
  line(projected[3].data[0][0], projected[3].data[1][0], projected[2].data[0][0], projected[2].data[1][0]);
  line(projected[5].data[0][0], projected[5].data[1][0], projected[2].data[0][0], projected[2].data[1][0]);
  line(projected[7].data[0][0], projected[7].data[1][0], projected[6].data[0][0], projected[6].data[1][0]);
  line(projected[7].data[0][0], projected[7].data[1][0], projected[3].data[0][0], projected[3].data[1][0]);
  line(projected[7].data[0][0], projected[7].data[1][0], projected[5].data[0][0], projected[5].data[1][0]);
  line(projected[1].data[0][0], projected[1].data[1][0], projected[6].data[0][0], projected[6].data[1][0]);
  line(projected[4].data[0][0], projected[4].data[1][0], projected[6].data[0][0], projected[6].data[1][0]);
  line(projected[1].data[0][0], projected[1].data[1][0], projected[3].data[0][0], projected[3].data[1][0]);
  line(projected[4].data[0][0], projected[4].data[1][0], projected[5].data[0][0], projected[5].data[1][0]);
}

windowResized = () => {
  resizeCanvas(windowWidth, windowHeight);
}

const ping = () => {
  console.log('pong');
}
