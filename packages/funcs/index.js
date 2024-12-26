const { app } = require('@azure/functions');

app.http('helloWorld1', {
    route: 'hello/world',
    handler: async (request, context) => {
        return {
          body: "Hello world!"
        }
    }
});
