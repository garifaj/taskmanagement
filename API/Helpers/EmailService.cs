using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using System.Web;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class EmailService
    {
        private readonly IConfiguration _config;
        private readonly string _frontendBaseUrl;

        public EmailService(IConfiguration config)
        {
            _config = config;
            _frontendBaseUrl = _config["AppSettings:FrontendBaseUrl"] ?? "http://localhost:5173";
        }
        // Shared method for sending emails
        private async Task SendEmailAsync(string toEmail, string subject, string htmlBody, string textBody)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(
                _config["EmailSettings:SenderName"],
                _config["EmailSettings:SenderEmail"]
            ));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = htmlBody,
                TextBody = textBody
            };

            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();

            int smtpPort = int.TryParse(_config["EmailSettings:SmtpPort"], out var port) ? port : throw new InvalidOperationException("SMTP port is not configured properly.");
            SecureSocketOptions options = smtpPort == 465
                ? SecureSocketOptions.SslOnConnect
                : SecureSocketOptions.StartTls;

            await client.ConnectAsync(
                _config["EmailSettings:SmtpServer"],
                smtpPort,
                options
            );

            await client.AuthenticateAsync(
                _config["EmailSettings:SenderEmail"],
                _config["EmailSettings:AppPassword"]
            );

            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }

        public async Task SendPasswordResetEmailAsync(string email, string resetToken)
        {
            string resetUrl = $"{_frontendBaseUrl}/reset-password/{HttpUtility.UrlEncode(resetToken)}";

            string subject = "Password Reset Request";
            string htmlBody = $@"
                <p>Hi,</p>
                <p>Click this link to reset your password:</p>
                <a href='{resetUrl}'>Reset Password</a>
                <p>This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
                <p>Thanks,<br/>Manage Support Team</p>";

            string textBody = $"Hi,\nClick the link to reset your password: {resetUrl}\nThis link will expire in 1 hour.";

            await SendEmailAsync(email, subject, htmlBody, textBody);
        }

        public async Task SendVerificationEmailAsync(string email, string verificationToken)
        {
            string verifyUrl = $"{_frontendBaseUrl}/verify-email/{HttpUtility.UrlEncode(verificationToken)}";

            string subject = "Verify Your Email Address";
            string htmlBody = $@"
                <p>Welcome! Please verify your email address:</p>
                <a href='{verifyUrl}'>Verify Email</a>
                <p>This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
                <p>Best regards,<br/>Manage Support Team</p>";

            string textBody = $"Welcome! Please verify your email address: {verifyUrl}";

            await SendEmailAsync(email, subject, htmlBody, textBody);
        }

        public async Task SendProjectInvitationEmailAsync(string email, int projectId, string inviteToken, string role)
        {
            string confirmationUrl = $"{_frontendBaseUrl}/confirm-invite?email={HttpUtility.UrlEncode(email)}&projectId={projectId}&token={HttpUtility.UrlEncode(inviteToken)}&role={HttpUtility.UrlEncode(role)}";

            string subject = "Project Invitation";
            string htmlBody = $@"
                <p>Hi,</p>
                <p>You have been invited to join a project as a <b>{role}</b>. Click the link below to accept:</p>
                <a href='{confirmationUrl}'>Join Project</a>
                <p>If you don't have an account, you'll need to register first.</p>
                <p>Thanks,<br/>Manage Support Team</p>";

            string textBody = $"You have been invited to join a project as a {role}. Visit the link to accept: {confirmationUrl}";

            await SendEmailAsync(email, subject, htmlBody, textBody);
        }

        public async Task SendTaskAssignedEmailAsync(string email, string taskTitle, string projectName, DateTime? dueDate, int projectId)
        {
            string projectUrl = $"{_config["AppSettings:FrontendBaseUrl"]}/dashboard/projects/{projectId}";

            string subject = $"You've been assigned a task: {taskTitle}";
            string htmlBody = $@"
                <p>Hi,</p>
                <p>You’ve been assigned to a new task:</p>
                <ul>
                    <li><strong>Task:</strong> {taskTitle}</li>
                    <li><strong>Project:</strong> {projectName}</li>" +
                            (dueDate.HasValue ? $"<li><strong>Due Date:</strong> {dueDate.Value.ToShortDateString()}</li>" : "") +
                        $@"</ul>
                <p><a href='{projectUrl}'>Click here to view the project board</a></p>
                <p>Thanks,<br/>Manage Support Team</p>";

            string textBody = $"You’ve been assigned to the task '{taskTitle}' in project '{projectName}'." +
                (dueDate.HasValue ? $" Due: {dueDate.Value.ToShortDateString()}." : "") +
                $" View project: {projectUrl}";

            await SendEmailAsync(email, subject, htmlBody, textBody);
        }



    }
}
