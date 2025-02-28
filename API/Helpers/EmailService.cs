using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security; // Add this for SecureSocketOptions

namespace API.Helpers
{
    public class EmailService
    {
        private readonly IConfiguration _config;
        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public void SendPasswordResetEmail(string email, string resetToken)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(
                _config["EmailSettings:SenderName"],
                _config["EmailSettings:SenderEmail"]
            ));
            message.To.Add(MailboxAddress.Parse(email));
            message.Subject = "Password Reset Request";

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = $@"
                <p>Hi,</p>
                <p>Click this link to reset your password:</p>
                <a href='http://localhost:5173/reset-password/{System.Web.HttpUtility.UrlEncode(resetToken)}'>
                    Reset Password
                </a>
                <p>This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
                <p>Thanks,</p>
                <p>Manage Support Team</p>"
            };

            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();

            // Determine security options based on port
            var smtpPort = int.Parse(_config["EmailSettings:SmtpPort"]);
            SecureSocketOptions secureSocketOptions = smtpPort == 465
                ? SecureSocketOptions.SslOnConnect
                : SecureSocketOptions.StartTls;

            // Use SecureSocketOptions instead of the boolean "UseSsl"
            client.Connect(
                _config["EmailSettings:SmtpServer"],
                smtpPort,
                secureSocketOptions // Fixed usage here!
            );

            client.Authenticate(
                _config["EmailSettings:SenderEmail"],
                _config["EmailSettings:AppPassword"]
            );

            client.Send(message);
            client.Disconnect(true);
        }

        public void SendVerificationEmail(string email, string verificationToken)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(
                _config["EmailSettings:SenderName"],
                _config["EmailSettings:SenderEmail"]
            ));
            message.To.Add(MailboxAddress.Parse(email));
            message.Subject = "Verify Your Email Address";

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = $@"
                <p>Welcome! Please verify your email address:</p>
                <a href='http://localhost:5173/verify-email/{System.Web.HttpUtility.UrlEncode(verificationToken)}'>
                    Verify Email
                </a>
                <p>This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
                <p>Best regards,<br/>Manage Support team</p>"
            };

            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();

            // Determine security options based on port
            var smtpPort = int.Parse(_config["EmailSettings:SmtpPort"]);
            SecureSocketOptions secureSocketOptions = smtpPort == 465
                ? SecureSocketOptions.SslOnConnect
                : SecureSocketOptions.StartTls;

            // Use SecureSocketOptions instead of the boolean "UseSsl"
            client.Connect(
                _config["EmailSettings:SmtpServer"],
                smtpPort,
                secureSocketOptions // Fixed usage here!
            );

            client.Authenticate(
                _config["EmailSettings:SenderEmail"],
                _config["EmailSettings:AppPassword"]
            );

            client.Send(message);
            client.Disconnect(true);
        }
    }
}
