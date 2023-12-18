const winston = require('winston');
class Log {
    /**
     * \u001b[31m - Red
     * \u001b[32m - Green
     * \u001b[33m - Dark Yellow
     * \u001b[34m - Violet
     * \u001b[35m - Pruple
     * \u001b[36m - Dark Cyan
     * \u001b[37m - White
     * \u001b[38m - Grey
     */

    static err = "\u001b[31m"
    static pass = "\u001b[32m"
    static warning = "\u001b[33m"
    static info = "\u001b[34m"
    static cmd = "\u001b[37m"


    static myFormat = winston.format.printf(({level, message, label, timestamp}) => {
        return label + `${timestamp} - ${level.padEnd(6, " ").toUpperCase()}: ${message}` + this.cmd
    })

    static logger = winston.createLogger({
        format:winston.format.combine(
            winston.format.timestamp(),
            this.myFormat
        ),
    transports: [new winston.transports.Console()]
    })

    static success(msg){
        this.logger.log({
            level: "info",
            message: "✅  " + msg,
            label: this.pass
        })
    }

    static error(msg){
        this.logger.log({
            level: "error",
            message: "❌  " + msg,
            label: this.err
        })
    }

    static warn(msg){
        this.logger.log({
            level: "warn",
            message: "⚠️  Warning! " + msg,
            label: this.warning
        })
    }

    static inform(msg){
        this.logger.log({
            level: "info",
            message: " ℹ️  " + msg,
            label: this.info
        })
    }
}

module.exports = Log