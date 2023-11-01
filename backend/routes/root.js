const express = require("express");
const app = express();
const router = express.Router();

router.get("/:name", (req, response) => {

    const {name} = req.params
    response.render('root', {name});
})

module.exports = router;