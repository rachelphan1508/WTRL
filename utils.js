class Utils{
    constructor(){

    };
    
    isCommand(str){
        return str[0] == '!';
    }

    getCommand(str){
        let index = str.indexOf(' ');
        return index == -1 ? str.slice(1) : str.slice(1, index);
    }

    getParameters(str){
        return str.split(' ').slice(1);
    }
    
    isNumeric(str) {
        if(typeof str != "string") return false;
        return !isNaN(str) && !isNaN(parseFloat(str));
    }
}

const utils = new Utils();

module.exports = utils;