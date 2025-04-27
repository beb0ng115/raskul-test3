testNumericPalindromes();


/**
 * Helper function to clean a string by removing non-alphanumeric characters
 * and converting to lowercase, without using regular expressions.
 *
 * @param {string} str - The input string to clean.
 * @returns {string} The cleaned string.
 */
function cleanString(str) {
    let cleaned = '';
    const lowerStr = str.toLowerCase(); // Convert to lowercase once upfront
  
    for (let i = 0; i < lowerStr.length; i++) {
      const char = lowerStr[i];
      // Check if the character is a letter (a-z) or a digit (0-9)
      const isLetter = char >= 'a' && char <= 'z';
      const isDigit = char >= '0' && char <= '9';
  
      if (isLetter || isDigit) {
        cleaned += char; // Append alphanumeric characters
      }
    }
    return cleaned;
  }
  
  
  /**
   * Checks if a given string is a palindrome using a for loop for comparison
   * and a simplified cleaning function.
   *
   * A palindrome is a word, phrase, number, or other sequence of characters
   * that reads the same backward as forward, such as madam or racecar.
   * This function ignores case and non-alphanumeric characters.
   *
   * @param {string} text - The input string to check.
   * @returns {boolean} True if the string is a palindrome, False otherwise.
   */
  function isPalindrome(text) {
    // Ensure input is a string
    if (typeof text !== 'string') {
      return false;
    }
  
    // 1. Clean the string using the simplified helper function
    const cleanedText = cleanString(text);
  
    // 2. Compare characters using a for loop
    const len = cleanedText.length;
    // Only need to loop up to the middle of the string
    for (let i = 0; i < len / 2; i++) {
      // Compare character from the start (i) with the corresponding character from the end (len - 1 - i)
      if (cleanedText[i] !== cleanedText[len - 1 - i]) {
        // If any pair doesn't match, it's not a palindrome
        return false;
      }
    }
  
    // 3. If the loop completes without finding mismatches, it's a palindrome.
    return true;
  }


function testNumericPalindromes() { // Rename function slightly?
    const assert = require('assert');
    // Assuming isPalindrome function is defined elsewhere or imported

    console.log("Running isPalindrome tests...");
    let testsPassed = 0;
    let testsFailed = 0;

    try {
        // --- Basic palindromes ---
        assert.strictEqual(isPalindrome("racecar"), true, "basic: racecar"); testsPassed++;
        assert.strictEqual(isPalindrome("level"), true, "basic: level"); testsPassed++;
        assert.strictEqual(isPalindrome("madam"), true, "basic: madam"); testsPassed++;

        // --- Palindromes needing cleaning (case, punctuation, spaces) ---
        assert.strictEqual(isPalindrome("A man, a plan, a canal: Panama"), true, "clean: Panama sentence"); testsPassed++;
        assert.strictEqual(isPalindrome("Was it a car or a cat I saw?"), true, "clean: Was it a car"); testsPassed++;
        assert.strictEqual(isPalindrome("No 'x' in Nixon"), true, "clean: Nixon quote"); testsPassed++;
        assert.strictEqual(isPalindrome("RaceCar"), true, "clean: Mixed case RaceCar"); testsPassed++;
        assert.strictEqual(isPalindrome("No lemon, no melon."), true, "clean: No lemon no melon"); testsPassed++;

        // --- Non-palindromes ---
        assert.strictEqual(isPalindrome("hello"), false, "non: hello"); testsPassed++;
        assert.strictEqual(isPalindrome("world"), false, "non: world"); testsPassed++;
        assert.strictEqual(isPalindrome("javascript"), false, "non: javascript"); testsPassed++;
        assert.strictEqual(isPalindrome("race a car"), false, "non: race a car"); testsPassed++; // Note: different from racecar

        // --- Edge cases ---
        assert.strictEqual(isPalindrome(""), true, "edge: empty string"); testsPassed++; // Empty string is often considered a palindrome
        assert.strictEqual(isPalindrome("a"), true, "edge: single char"); testsPassed++; // Single char is a palindrome
        assert.strictEqual(isPalindrome(" "), true, "edge: single space"); testsPassed++; // Space gets removed -> empty
        assert.strictEqual(isPalindrome(".,!?"), true, "edge: only punctuation"); testsPassed++; // Punctuation removed -> empty

        // --- Numeric strings ---
        assert.strictEqual(isPalindrome("121"), true, "numeric: 121"); testsPassed++;
        assert.strictEqual(isPalindrome("1001"), true, "numeric: 1001"); testsPassed++;
        assert.strictEqual(isPalindrome("1 Able was I ere I saw Elba 1"), true, "numeric: Mixed alpha-numeric"); testsPassed++;
        assert.strictEqual(isPalindrome("123"), false, "numeric non: 123"); testsPassed++;
        assert.strictEqual(isPalindrome("123210"), false, "numeric non: 123210"); testsPassed++;

        // --- Handling non-string inputs (assuming function should return false, not throw) ---
        assert.strictEqual(isPalindrome(121), false, "type: number 121"); testsPassed++;
        assert.strictEqual(isPalindrome(123.321), false, "type: float number"); testsPassed++; // Add a float
        assert.strictEqual(isPalindrome(null), false, "type: null"); testsPassed++;
        assert.strictEqual(isPalindrome(undefined), false, "type: undefined"); testsPassed++;
        assert.strictEqual(isPalindrome([]), false, "type: array"); testsPassed++;
        assert.strictEqual(isPalindrome({}), false, "type: object"); testsPassed++; // Add an object

    } catch (error) {
        testsFailed++;
        console.error("TEST FAILED:", error.message);
        // Optionally re-throw or handle differently
    } finally {
        console.log("--------------------");
        console.log(`Tests finished. Passed: ${testsPassed}, Failed: ${testsFailed}`);
        if (testsFailed === 0) {
            console.log("✅ All tests passed!");
        } else {
            console.log("❌" + testsFailed + " tests failed.");
        }
    }
}


