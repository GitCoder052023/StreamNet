const { sendEmail } = require('../utils/emailService');

class QueryController {
    constructor(queryModel, userModel) {
        this.Query = queryModel;
        this.User = userModel;
    }

    async submitQuery(req, res) {
        try {
            const { message } = req.body;
            const { userId } = req.user;

            const user = await this.User.findUserByEmail(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const queryData = {
                fullName: user.fullName,
                email: user.email,
                message,
            };

            await this.Query.createQuery(queryData);

            const emailText = `
Dear ${user.fullName},

Thank you for reaching out to QChat Support. This is an automated response to confirm that we have received your request.

Our team is reviewing your inquiry and will get back to you as soon as possible. If your issue is urgent, please ensure you have provided all necessary details, such as your registered email, device information, and a brief description of the problem.

In the meantime, you may check our FAQ section or community forums for quick solutions.

We appreciate your patience and will do our best to assist you promptly.

Best regards,
QChat Support Team
            `;

            await sendEmail(
                user.email,
                'QChat Support – How Can We Assist You?',
                emailText
            );

            res.json({ message: 'Query submitted successfully' });
        } catch (error) {
            console.error('Query submission error:', error);
            res.status(500).json({ message: 'Failed to submit query' });
        }
    }
}

module.exports = QueryController;
