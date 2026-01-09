export const EMAIL_SUBJECTS = {
  STUDENT_ABSENT: "Student Absence Notification",
  LEAVE_STATUS_UPDATE: "Leave Request Status Update",
} as const;

export const EmailTemplates = {
  studentAbsent: ({
    studentName,
    status,
    session,
    date,
  }: {
    studentName: string;
    status: string;
    session: string;
    date: string;
  }) => `
Dear Parent,

Your child ${studentName} was marked ${status} for the ${session} session on ${date}.

Please contact the school for any clarifications.

Regards,
School Administration
  `.trim(),

  leaveStatusUpdate: ({
    teacherName,
    status,
    leaveType,
    startDate,
    endDate,
    totalDays,
    adminRemark,
    instituteName,
    instituteLogo,
  }: {
    teacherName: string;
    status: "APPROVED" | "REJECTED" | "CANCELLED";
    leaveType: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    adminRemark?: string;
    instituteName: string;
    instituteLogo?: string;
  }) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Leave Status Update</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:20px; text-align:center; border-bottom:1px solid #eee;">
              ${instituteLogo
      ? `<img src="${instituteLogo}" alt="${instituteName} Logo" style="max-height:60px; margin-bottom:10px;" />`
      : ""
    }
              <h2 style="margin:0; color:#2c3e50;">${instituteName}</h2>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:24px; color:#333;">
              <p style="font-size:14px;">Dear <strong>${teacherName}</strong>,</p>

              <p style="font-size:14px;">
                Your leave request has been <strong>${status.toLowerCase()}</strong>.
              </p>

              <!-- Status Badge -->
              <div style="text-align:center; margin:24px 0;">
                <span style="
                  display:inline-block;
                  padding:8px 16px;
                  font-size:14px;
                  font-weight:bold;
                  color:#ffffff;
                  border-radius:4px;
                  background-color:${status === "APPROVED"
      ? "#28a745"
      : status === "REJECTED"
        ? "#dc3545"
        : "#6c757d"
    };
                ">
                  ${status}
                </span>
              </div>

              <!-- Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                <tr>
                  <td style="padding:6px 0;"><strong>Leave Type:</strong></td>
                  <td style="padding:6px 0;">${leaveType}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;"><strong>Duration:</strong></td>
                  <td style="padding:6px 0;">${startDate} to ${endDate}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;"><strong>Total Days:</strong></td>
                  <td style="padding:6px 0;">${totalDays}</td>
                </tr>
                ${adminRemark
      ? `
                <tr>
                  <td style="padding:6px 0;"><strong>Admin Remark:</strong></td>
                  <td style="padding:6px 0;">${adminRemark}</td>
                </tr>`
      : ""
    }
              </table>

              <p style="margin-top:20px; font-size:14px;">
                If you have any questions or require further clarification, please contact the administration office.
              </p>

              <p style="font-size:14px;">Regards,<br/>
              <strong>${instituteName} Administration</strong></p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb; padding:16px; text-align:center; font-size:12px; color:#777;">
              <p style="margin:0;">
                This is an automated message. Please do not reply to this email.
              </p>
              <p style="margin:4px 0 0;">
                &copy; ${new Date().getFullYear()} ${instituteName}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`.trim(),
};
