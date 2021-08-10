function log(ctx) {
  console.log(ctx);
}

module.exports = function () {
  return async function (ctx, next) {
    await next();
    console.log("---log start---");
    log(ctx);
    console.log("---log end---");
  };
};
