const colors = require('colors');
const fs     = require('fs');

module.exports = class Loger{
    constructor (name, level) {
        this.name = name;
        this.messageLevel = level || 3;
        this.gefaultLevel = 3;
        this.logFilePath = './log/log.txt';
        this.time = true;
    }

    log (message, level) {
        level = level || this.gefaultLevel;
        if( level <= this.messageLevel) {
            let type = ' ';
            let typeF = ' ';
            let time = '';
            let timeF = '';
            let name = this.name.cyan;
            let nameF = this.name;

            switch (level) {
                case 3:
                    type = '[info] '.green;
                    typeF = '[info] ';
                break;
                case 2:
                    type = '[warn] '.yellow;
                    typeF = '[warn] ';
                break;
                case 1:
                    name = this.name.red;
                    type = '[error] '.red;
                    typeF = '[error] ';
                break;
            }

            if ( this.time ) {
                time = this.getTime().red;
                timeF = this.getTime();
            }
            console.log(type + time + name + ':', message);
            // if (this.logFilePath) {
            //     fs.appendFileSync(this.logFilePath, typeF + timeF + nameF + ': ' + message + "\r\n")
            // }
        }
    }

    /**
     * You can change the timeout setting
     * @param value (boolean)
     */
    setTimeWrite ( value ) {
        this.time = value;
    }
    getTime () {
        let time = new Date();
        return '[' + time.getHours() + ':' + time.getMinutes() + ':' +  time.getSeconds() + ' ' + time.getMilliseconds() + '] ';
    }
    setLevel (level) {
        this.messageLevel = level;
    }
    setDefaultLevel (level) {
        this.gefaultLevel = level;
    }
}