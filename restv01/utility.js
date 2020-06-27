export function Result(req, dbRes, msg) {
    return {
        "req": req,
        "dbRes": dbRes,
        "msg": msg
    };
};

export function OkResult(req, dbRes) {
    return {
        "req": req,
        "dbRes": dbRes,
        "msg": null
    };
};

export function BadRequestResult(msg) {
    return {        
        "req": null,
        "dbRes": null,
        "msg": msg
    };
};