const requestTime = (request, respponse, next) => {
    console.log(
        `Request received at ${Date.now()}: ${request.method}`
    );

    next();
}

module.exports = requestTime;