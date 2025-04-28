
/**
 * Rotates an n-by-n matrix (array of arrays) 90 degrees counter-clockwise.
 *
 */
function rotateMatrixCounterClockwise(matrix) {
    console.log(matrix);
    
    if (!Array.isArray(matrix) || matrix === null || matrix === undefined) {
        if (matrix === null || matrix === undefined) {
            throw new TypeError("Input matrix cannot be null or undefined."); // Match C# null check conceptually
         }
         else {
            throw new TypeError("Input must be an array.");
         }
    }
    
  
    const n = matrix.length; 
  
    if (n === 0) {
        if (matrix[0] && matrix[0].length !== 0) {
             throw new Error("Input matrix must be square (n-by-n). Found 0 rows but columns > 0.");
        }
        return []; 
    }
  
    // Check if all rows have the same length 'n'
    for (let r = 0; r < n; r++) {
      if (!Array.isArray(matrix[r])) {
          throw new TypeError(`Element at row index ${r} is not an array.`);
      }
      if (matrix[r].length !== n) {
        throw new Error(`Input matrix must be square (n-by-n). Row ${r} has length ${matrix[r].length}, expected ${n}.`);
      }
    }
  
  
    const rotatedMatrix = new Array(n);
    for (let i = 0; i < n; i++) {
      rotatedMatrix[i] = new Array(n);
    }
    for (let r = 0; r < n; r++) { // r = row index of original
      for (let c = 0; c < n; c++) { // c = column index of original
        // Calculate the new position after 90-degree counter-clockwise rotation
        // Original [r][c] maps to New [n - 1 - c][r]
        const newRow = n - 1 - c;
        const newCol = r;
  
        // Assign the value to the new position in the rotated matrix
        rotatedMatrix[newRow][newCol] = matrix[r][c];
      }
    }
  
    return rotatedMatrix;
  }
  
  // Export the function to make it available for import in tests or other modules
  module.exports = { rotateMatrixCounterClockwise };
  
  