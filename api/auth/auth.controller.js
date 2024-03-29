const authService = require('./auth.service')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')

async function authenticate(req, res) {
    const credentials = req.body
    const { phoneNum } = credentials
    let { accessToken } = req.cookies
    // console.log(credentials, phoneNum,'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    let user
    try {
        if (accessToken) {
            user = authService.verifyJwt(accessToken)
            if (user) user = await authService.login(user.phoneNum)
        }
        if (!user && phoneNum) {
            user = await authService.login(phoneNum)
            // if (user) authService.signJwt(user)
            if (!user) {
                user = await authService.signup(credentials)
            }
            res.cookie('accessToken', authService.signJwt(user),{expires:new Date(Date.now()+99999999999999999999999999999999999)})
        }
        // logger.info('User login: ', user)
        res.json(user)
    } catch (err) {
        // logger.error('Failed to authenticate ' + err)
        res.status(401).send({ err: 'Failed to authenticate now' })
    }
}
const arr = [1,2,3]
arr.find(({num},idx)=>{num === 1} /* true for first loop */)

// async function login(req, res) {
//     const { username, password } = req.body
//     try {
//         const user = await authService.login(username, password)
//         const loginToken = authService.getLoginToken(user)
//         logger.info('User login: ', user)
//         res.cookie('loginToken', loginToken)
//         res.json(user)
//     } catch (err) {
//         logger.error('Failed to Login ' + err)
//         res.status(401).send({ err: 'Failed to Login' })
//     }
// }

// async function signup(req, res) {
//     try {
//         const credentials = req.body
//         // Never log passwords
//         // logger.debug(credentials)
//         const account = await authService.signup(credentials)
//         logger.debug(`auth.route - new account created: ` + JSON.stringify(account))
//         const user = await authService.login(credentials.username, credentials.password)
//         logger.info('User signup:', user)
//         const loginToken = authService.getLoginToken(user)
//         res.cookie('loginToken', loginToken)
//         res.json(user)
//     } catch (err) {
//         logger.error('Failed to signup ' + err)
//         res.status(500).send({ err: 'Failed to signup' })
//     }
// }

async function logout(req, res) {
    try {
        res.clearCookie('accessToken')
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        res.status(500).send({ err: 'Failed to logout' })
    }
}

module.exports = {
    // login,
    // signup,
    authenticate,
    logout
}