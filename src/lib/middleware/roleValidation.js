const { validRoles } = require('../config/roleMapping')

function roleValidation(req, res, next) {
  const rolesHeader = req.headers['x-contentful-roles']
  if (!rolesHeader)
    return res.status(401).json({ error: 'Missing X-Contentful-Roles header' })
  const userRoles = rolesHeader.split(',').map((r) => r.trim())
  const invalid = userRoles.some((role) => !validRoles.includes(role))
  if (invalid)
    return res.status(401).json({ error: 'Invalid role(s) provided' })
  req.userRoles = userRoles
  next()
}

module.exports = roleValidation
