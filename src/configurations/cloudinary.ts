const cloudinary = require('cloudinary').v2

cloudinary.config({
  // eslint-disable-next-line @typescript-eslint/camelcase
  cloud_name: process.env.CLOUD_NAME,
  // eslint-disable-next-line @typescript-eslint/camelcase
  api_key: process.env.CLOUD_KEY,
  // eslint-disable-next-line @typescript-eslint/camelcase
  api_secret: process.env.CLOUD_SECRET,
})

export default cloudinary
