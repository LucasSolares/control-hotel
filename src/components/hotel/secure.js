const Auth = require('../../auth')
const response = require('../../network/response')

exports.checkAuth = (action) => {

    function authMiddleWare(req, res, next) {

        try {

            const token = Auth.decodeAuthorization(req)
            const payload = Auth.decodeToken(token)

            switch (action) {
                case 'updateOrDelete':
                    req.body._id = payload.sub
                    next()
                    break

                case 'list':
                    req.payload = payload
                    next()
                    break

                default:
                    throw { message: 'Not implemented yet', code: 500 }
            }
        } catch (error) {
            response.error(res, error.code)
        }
    }

    return authMiddleWare

}