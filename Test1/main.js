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