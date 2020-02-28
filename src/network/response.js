const statusResponses = {

    '200': 'OK!',
    '201': 'CREATED!',
    '400': 'CLIENT ERROR!',
    '404': 'NOT FOUND!',
    '401': 'UNAUTHORIZED',
    '500': 'INTERNAL SERVER ERROR'

}

exports.success = (res, data, statusCode = 200) => 
    res.status(statusCode).send({error: false, message: statusResponses[statusCode], data, status: statusCode})

exports.error = (res, statusCode = 500) =>
    res.status(statusCode).send({error: true, message: statusResponses[statusCode], data: null})
