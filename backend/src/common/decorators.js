const { createParamDecorator, ExecutionContext } = require('@nestjs/common');

const GetUser = createParamDecorator((data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});

module.exports = { GetUser };

