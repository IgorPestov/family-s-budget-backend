
module.exports = {
  jwt: {
    tokens: {
      access: {
        type: "access",
        expiresIn: "10m",
      },
      refresh: {
        type: "refresh",
        expiresIn: "10s",
      },
      restartPassword: {
        type: "reset",
        expiresIn: "10m",
      },
    },
  },
};
