const mongoose = require("mongoose");
const  server  = require("./app");
const logger = require("./src/config/logger");
const config = require("./src/config/config");
const dns = require("dns")
// IPv4 force 
dns.setDefaultResultOrder("ipv4first");

// Use Google DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);


mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
    logger.info("Connected to MongoDB");
    server.listen(config.PORT, () => {
      // logger.info('Socket connected');
      logger.info(`Listening to port ${config.PORT}`);
    });
  });


const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};


process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
