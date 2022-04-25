const User = require('../users/user-model')

function checkMissingInputs (req, res, next) {
    const { username, password } = req.body
    if (!username || !password) {
        res.status(401).json({
            message: 'username and password required'
        })
    } else {
        next()
    }
}

async function checkUsernameTaken (req, res, next) {
    try {
        const users = await User.findBy({ username: req.body.username })
        if (!users.length) {
            next()
        } else {
            res.status(422).json({
                message: "username taken"
            })
        }
    } catch (err) {
        next(err)
    }
}

// async function checkUsernameDataExists (req, res, next) {
//     try {
//         const user = await User.findBy({ username: req.body.username })
//         if (user.length) {
//             req.user = user[0]
//             next()
//         } else {
//             res.status(401).json({
//                 message: "invalid credentials"
//             })
//         }
//     } catch (err) {
//         next(err)
//     }
// }

module.exports = {
    checkMissingInputs,
    checkUsernameTaken,
    // checkUsernameDataExists
}