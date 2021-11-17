const withImages = require("next-images");
module.exports = {
  ...withImages(),
  ...withImages(),
  future: {
    webpack5: true,
  },
};
