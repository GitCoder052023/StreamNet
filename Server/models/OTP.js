class OTP {
    constructor(db) {
        this.collection = db.collection('otps');
    }

    async createOTP(otpData) {
        return this.collection.insertOne(otpData);
    }

    async verifyOTP(email, otp, purpose) {
        return this.collection.findOne({
            email,
            otp,
            purpose,
            expiresAt: { $gt: new Date() }
        });
    }

    async deleteOTP(email, purpose) {
        return this.collection.deleteMany({ email, purpose });
    }
}

module.exports = OTP;
