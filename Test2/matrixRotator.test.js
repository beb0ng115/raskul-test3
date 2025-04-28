
// Import the function to test
const { rotateMatrixCounterClockwise } = require('./matrixRotator'); 

// Describe block groups related tests
describe('rotateMatrixCounterClockwise', () => {

  // Test case for 1x1 matrix
  test('should return the same matrix for a 1x1 input', () => {
    // Arrange
    const inputMatrix = [[5]];
    const expectedMatrix = [[5]];

    // Act
    const actualMatrix = rotateMatrixCounterClockwise(inputMatrix);

    // Assert
    // .toEqual checks for deep equality (values) for arrays/objects
    expect(actualMatrix).toEqual(expectedMatrix);
  });

  // Test case for 2x2 matrix
  test('should correctly rotate a 2x2 matrix counter-clockwise', () => {
    // Arrange
    const inputMatrix = [
      [1, 2],
      [3, 4]
    ];
    const expectedMatrix = [
      [2, 4],
      [1, 3]
    ];

    // Act
    const actualMatrix = rotateMatrixCounterClockwise(inputMatrix);

    // Assert
    expect(actualMatrix).toEqual(expectedMatrix);
  });

  // Test case for 3x3 matrix
  test('should correctly rotate a 3x3 matrix counter-clockwise', () => {
    // Arrange
    const inputMatrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];
    const expectedMatrix = [
      [3, 6, 9],
      [2, 5, 8],
      [1, 4, 7]
    ];

    // Act
    const actualMatrix = rotateMatrixCounterClockwise(inputMatrix);

    // Assert
    expect(actualMatrix).toEqual(expectedMatrix);
  });

  // Test case for 4x4 matrix
  test('should correctly rotate a 4x4 matrix counter-clockwise', () => {
    // Arrange
    const inputMatrix = [
      [ 1,  2,  3,  4],
      [ 5,  6,  7,  8],
      [ 9, 10, 11, 12],
      [13, 14, 15, 16]
    ];
    const expectedMatrix = [
      [ 4,  8, 12, 16],
      [ 3,  7, 11, 15],
      [ 2,  6, 10, 14],
      [ 1,  5,  9, 13]
    ];

    // Act
    const actualMatrix = rotateMatrixCounterClockwise(inputMatrix);

    // Assert
    expect(actualMatrix).toEqual(expectedMatrix);
  });

  // Test case for 0x0 matrix
  test('should return an empty array for a 0x0 input matrix', () => {
    // Arrange
    const inputMatrix = [];
    const expectedMatrix = [];

    // Act
    const actualMatrix = rotateMatrixCounterClockwise(inputMatrix);

    // Assert
    expect(actualMatrix).toEqual(expectedMatrix);
    expect(actualMatrix.length).toBe(0); // Explicit check for empty array
  });

   // Test case for 3x3 matrix with zeros and duplicates
  test('should correctly rotate a 3x3 matrix with zeros and duplicates', () => {
    // Arrange
    const inputMatrix = [
      [1, 0, 1],
      [0, 5, 0],
      [1, 0, 1]
    ];
    const expectedMatrix = [
      [1, 0, 1],
      [0, 5, 0],
      [1, 0, 1]
    ];

    // Act
    const actualMatrix = rotateMatrixCounterClockwise(inputMatrix);

    // Assert
    expect(actualMatrix).toEqual(expectedMatrix);
  });


  // --- Exception Test Cases ---

  // Test for null input
  test('should throw a TypeError for null input', () => {
    // Arrange
    const inputMatrix = null;

    // Act & Assert
    // Wrap the function call in an arrow function for Jest to catch the error
    expect(() => rotateMatrixCounterClockwise(inputMatrix)).toThrow(TypeError);
    // Optional: Check for specific error message
    expect(() => rotateMatrixCounterClockwise(inputMatrix)).toThrow(/cannot be null or undefined/);
  });

  // Test for undefined input
  test('should throw a TypeError for undefined input', () => {
    // Arrange
    const inputMatrix = undefined;

    // Act & Assert
    expect(() => rotateMatrixCounterClockwise(inputMatrix)).toThrow(TypeError);
    expect(() => rotateMatrixCounterClockwise(inputMatrix)).toThrow(/cannot be null or undefined/);

  });

  test('should throw a TypeError for non-array input', () => {
    const inputMatrix = "not an array";

    // Act & Assert
    expect(() => rotateMatrixCounterClockwise(inputMatrix)).toThrow(TypeError);
    expect(() => rotateMatrixCounterClockwise(inputMatrix)).toThrow(/Input must be an array/);
  });


  // Test for non-square matrix (inconsistent row lengths)
  test('should throw an Error for a non-square matrix (ragged array)', () => {
    // Arrange
    const inputMatrix = [
        [1, 2, 3],
        [4, 5] // Shorter row
    ];

    // Act & Assert
    expect(() => rotateMatrixCounterClockwise(inputMatrix)).toThrow(Error);
    // Optional: Check for specific error message
    expect(() => rotateMatrixCounterClockwise(inputMatrix)).toThrow(/Input matrix must be square/);
  });

  // Test for non-square matrix (rows != columns)
  test('should throw an Error for a non-square matrix (rows != cols)', () => {
    // Arrange
    const inputMatrix = [ // 2x3 matrix
        [1, 2, 3],
        [4, 5, 6]
    ];

    // Act & Assert
    // The error will likely be caught by the row length check in this implementation
    expect(() => rotateMatrixCounterClockwise(inputMatrix)).toThrow(Error);
    expect(() => rotateMatrixCounterClockwise(inputMatrix)).toThrow(/Input matrix must be square/);
  });

   // Test for matrix containing non-array rows
  test('should throw a TypeError if a row is not an array', () => {
    // Arrange
    const inputMatrix = [
        [1, 2],
        "not an array" // Invalid row
    ];

    // Act & Assert
    expect(() => rotateMatrixCounterClockwise(inputMatrix)).toThrow(TypeError);
    expect(() => rotateMatrixCounterClockwise(inputMatrix)).toThrow(/Element at row index 1 is not an array/);
  });

});
