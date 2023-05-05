const express = require("express");
const passport = require("passport");
const router = express.Router();

const OrganizationObject = require("../models/organization");

const SERVER_ERROR = "SERVER_ERROR";
const ORGANIZATION_ALREADY_EXISTS = "ORGANIZATION_ALREADY_EXISTS";

router.get("/", passport.authenticate("user", { session: false }), async (req, res) => {
    try {
        const data = await OrganizationObject.find({ ...req.query }).sort("-last_updated_at");
        return res.status(200).send({ ok: true, data });
    } catch (error) {
        console.log(error);
        res.status(500).send({ ok: false, code: SERVER_ERROR, error });
    }
});

router.get("/:id", passport.authenticate("user", { session: false }), async (req, res) => {
    try {
        const data = await OrganizationObject.find({ _id: req.params.id });
        return res.status(200).send({ ok: true, data });
    } catch (error) {
        console.log(error);
        res.status(500).send({ ok: false, code: SERVER_ERROR, error });
    }
});

router.post("/", passport.authenticate("user", { session: false }), async (req, res) => {
    try {
        const data = await OrganizationObject.create({ ...req.body });
        return res.status(200).send({ data, ok: true });
    } catch (error) {
        if (error.code === 11000) return res.status(409).send({ ok: false, code: PROJECT_ALREADY_EXISTS });
        console.log(error);
        return res.status(500).send({ ok: false, code: SERVER_ERROR });
    }
});

router.put("/:id", passport.authenticate("user", { session: false }), async (req, res) => {
    try {
        const obj = req.body;
        const data = await OrganizationObject.findByIdAndUpdate(req.params.id, obj, { new: true });

        res.status(200).send({ ok: true, data });
    } catch (error) {
        console.log(error);
        res.status(500).send({ ok: false, code: SERVER_ERROR, error });
    }
});

router.delete("/:id", passport.authenticate("user", { session: false }), async (req, res) => {
    try {
        await OrganizationObject.findOneAndRemove({ _id: req.params.id });
        res.status(200).send({ ok: true });
    } catch (error) {
        console.log(error);
        res.status(500).send({ ok: false, code: SERVER_ERROR, error });
    }
});

module.exports = router;