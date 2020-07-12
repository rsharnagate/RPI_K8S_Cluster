module.exports = {

    Result : (req, dbRes, msg) => {
        return {
            "req": req,
            "dbRes": dbRes,
            "msg": msg
        };
    },
    
    OkResult : (req, dbRes) => {
        return {
            "req": req,
            "dbRes": dbRes,
            "msg": null
        };
    },
    
    BadRequestResult : (msg) => {
        return {        
            "req": null,
            "dbRes": null,
            "msg": msg
        };
    },
}   