const routes = require("./shows");

const constructorMethod = (app) => {
    app.use("/", routes);
    app.use('*', (req, res) => {
        res.status(404).render('error', {error: "No page found."});
    });
};

module.exports = constructorMethod;