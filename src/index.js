const app = require('./app');

const port = process.env.PORT || 3000;
async function main() {
   await app.listen(port, () => console.log(`Listening on port ${port} ...`));
}

main();