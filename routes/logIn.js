var express = require("express");
var router = express.Router();
router.post("/logIn", (req, res) => {

    dataFetcher.authenticate(req.body.userNameLn, req.body.passwordLn).then((data) => {
        if (data != "") {
                res.rend("layouts/main");
            } else {
                res.redirect("/");
            }

            var user = JSON.stringify(data);
            user = JSON.parse(user);
            console.log(user.id);
        });
    });

    module.exports = router;
