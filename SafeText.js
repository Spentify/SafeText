/* 
    SafeText 1.0.1 by Spentify, 30.12.2020 
    No copyright! Free to use for everybody.
*/


let SafeText = {
    help() {
        console.log("--SafeText Usage-- \n\n \t functions: \n \t\t\t SafeText.encrypt(string) -> returns and object, containing the encrypted string. Properties: object.text => encrypted text, object.key => JSON key for decrypting. \n \t\t\t SafeText.decrypt(string, key) -> returns a decrypted string. \n\n \t Properties: \n \t\t\t SafeText.threshold -> pre-encryption string shuffle treshhold. Default: 5 NOTE: THIS MUST BE SMALLER THAN THE AMOUNT OF INDIVIDUAL CHARACTERS IN THE STRING TO BE ENCRYPTED \n \t\t\t SafeText.range -> sets the range of random UTF-8 characters to be used for encryption. Default: 15000");
    },
    __range: [33, 15000],
    get range() {
        return this.__range;
    },
    set range(s) {
        if (s > 65000) {
            throw new RangeError("Maximum range is 65000.");
        }
        this.__range[1] = s + 33;
    },
    __threshold: 5,
    get threshold() {
        return this.__threshold;
    },
    set threshold(s) {
        if (s > 200) {
            console.warn("Caution: A treshhold above 200 is not recommended.");
        }
        this.__threshold = s;
    },
    encrypt(str) {
        if (typeof str == undefined || str == "") {
            throw new SyntaxError("1 parameter required: (string). Note: Empty strings are invalid.");
        }
        let chars = [],
        usedChars = [],
        changedChars = [],
        keyData = [
            [],
            [],
            randomVal()
        ];
        function randomChar(range) {
            res = String.fromCharCode(Math.floor(Math.random() * (range[1] - range[0])) + range[0]);
            if (!usedChars.includes(res)) {
                return res;
            }
            else {
                return randomChar(res);
            }           
        }
        function randomVal() {
            let res = chars.length > 0 ? Math.floor(Math.random() * (chars.length - 1)) : [Math.floor(Math.random() * (10 - 1) ) + 1, Math.floor(Math.random() * (10 - 1) ) + 1];
            if (!changedChars.includes(res)) {
                return res;
            }
            else {
                return randomVal();
            }
                
        }
        for (let i in str) {
            if (!chars.includes(str[i])) {
                chars.push(str[i]);
            }
        }
        if (chars.length <= this.__threshold) {
            this.__threshold = chars.length - 1;
            console.log("SafeText.threshold can't be greater than the amont of individual characters in the string to be encrypted. For further information, call SafeText.help()");
        }
        for (let i2 = 0; i2 < this.threshold; i2++) {
            let randomValue = randomVal();
            changedChars.push(randomValue);
            let randomValue2 = Math.ceil(Math.random() * (chars.length - 1));
            str = str.replaceAll(chars[randomValue], String.fromCharCode(chars[randomValue].charCodeAt(0) * randomValue2));
            chars[randomValue] = String.fromCharCode(chars[randomValue].charCodeAt(0) * randomValue2);
            keyData[0].push([chars[randomValue], randomValue2]);
        }
        for (let i3 of chars) {
            let oldChar = parseFloat((i3.charCodeAt(0) * (keyData[2][0]/keyData[2][1])).toFixed(4));
            let newChar = randomChar(this.__range);
            usedChars.push(newChar);
            keyData[1].push(oldChar);
            str = str.replaceAll(i3, newChar);
        }
        return {text: str, key: JSON.stringify(keyData)};
    },
    decrypt(str, key) {
        if (typeof str == undefined) {
            throw new SyntaxError("2 parameters required: (encryped string, JSON decryption key)");
        }
        if (typeof key == undefined) {
            throw new TypeError("Decryption key required.");
        }
        let chars = [],
        keys = JSON.parse(key);
        for (let i in str) {
            if (!chars.includes(str[i])) {
                let count = 0;
                for (let i_2 in keys[0]) {
                    if (keys[0][i_2][0].includes(str[i])) {
                        count++;
                    }
                }
                if (count == 0) {
                    chars.push(str[i]);
                }
            }
        }
        for (let i2 in chars) {
            str = str.replaceAll(chars[i2], String.fromCharCode(Math.round(keys[1][i2] / (keys[2][0] / keys[2][1]))));
        }
        for (let i3 in keys[0]) {
            str = str.replaceAll(keys[0][i3][0], String.fromCharCode(keys[0][i3][0].charCodeAt(0) / keys[0][i3][1]));
        }
        return str;
    }
}
