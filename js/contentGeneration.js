/*
    return a String of randomly generated text
    @input len : length of required String
    @input uppercase: convert characters to Uppercase (defaults to false)
*/

function generateLetterContent(len, uppercase) {
    len = len || 8;
    uppercase = uppercase || false;
    var returnString = "";
    var letterNumber;

    for (var i = 0; i < len; i++) {
        letterNumber = randomMinMax(97, 122);
        returnString += String.fromCharCode(letterNumber);
    }

    if (uppercase) {
        returnString = returnString.toUpperCase();
    }
    return returnString;
}

/*
    return a string of random number
    @input len : length of return String (defaults to 5)
*/
function generateNumberContent(len) {
    len = len || 5;
    let returnVal = "";
    for (var i = 0; i < len; i++) {
        returnVal += Math.floor(Math.random() * 10);
    }

    return returnVal;
}