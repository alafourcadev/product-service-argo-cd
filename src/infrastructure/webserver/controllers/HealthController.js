class HealthController {
    static getHealth(req, res) {
        res.status(200).json({ status: ' Test Ok!!!!' });
    }
}

module.exports = HealthController;
