// next.config.js
const withOptimizedImages = require("next-optimized-images");

module.exports = withOptimizedImages({
  images: {
    loader: "imgix",
    path: "",
  },
  future: {
    webpack5: true,
  },
});
