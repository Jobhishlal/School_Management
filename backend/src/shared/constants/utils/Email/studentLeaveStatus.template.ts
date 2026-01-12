interface StudentLeaveEmailParams {
  studentName: string;
  status: "APPROVED" | "REJECTED";
  leaveType: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  message?: string;
}

export const studentLeaveStatusTemplate = ({
  studentName,
  status,
  leaveType,
  startDate,
  endDate,
  reason,
  message
}: StudentLeaveEmailParams): { subject: string; html: string } => {

  const statusColor = status === "APPROVED" ? "#4CAF50" : "#F44336";

  return {
    subject: `Leave Request Update - ${studentName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <div style="background:#2c3e50;color:#fff;padding:16px;text-align:center;">
          <h2>School Management System</h2>
        </div>

        <div style="padding:20px;">
          <p>Dear Parent,</p>

          <p>
            The leave request for <strong>${studentName}</strong>
            has been reviewed by the class teacher.
          </p>

          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td><strong>Status</strong></td>
              <td style="color:${statusColor};font-weight:bold;">
                ${status}
              </td>
            </tr>
            <tr>
              <td><strong>Leave Type</strong></td>
              <td>${leaveType}</td>
            </tr>
            <tr>
              <td><strong>Dates</strong></td>
              <td>
                ${startDate.toLocaleDateString()} -
                ${endDate.toLocaleDateString()}
              </td>
            </tr>
            <tr>
              <td><strong>Reason</strong></td>
              <td>${reason}</td>
            </tr>
            <tr>
              <td><strong>Teacher Remarks</strong></td>
              <td>${message || "None"}</td>
            </tr>
          </table>

          <p style="margin-top:20px;">
            Please contact the class teacher for further clarification.
          </p>
        </div>

        <div style="background:#f5f5f5;text-align:center;padding:10px;">
          <small>© ${new Date().getFullYear()} School Management System</small>
        </div>
      </div>
    `
  };
};
