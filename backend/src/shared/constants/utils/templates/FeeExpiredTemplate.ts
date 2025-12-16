export const feeExpiredTemplate = (
  parentName: string,
  studentName: string
) => `
  <h3>Fee Payment Due Date Over</h3>
  <p>Dear ${parentName},</p>

  <p>
    The fee payment for <strong>${studentName}</strong> has not been completed
    before the due date.
  </p>

  <p>Please contact the school administration.</p>

  <br/>
  <p>Regards,<br/>School Admin</p>
`;