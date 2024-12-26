const { app } = require('@azure/functions');

const helloWorld = async (request, context) => {
  context.log('HTTP trigger function processed a request.');
  return { body: "Hello world!" };
};

app.http('helloWorld1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: helloWorld,
    route: 'hello/world'
});

module.exports = app;
