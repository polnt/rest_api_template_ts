export const checkEmailDuplicate = async (
  email: string,
  MySQLClient
): Promise<{ status: number; message: string; data?: any }> => {
  try {
    if (email) {
      const connection = await MySQLClient.getConnection();
      const [rows] = await connection.query(
        "SELECT id, email FROM user WHERE email = ?",
        email
      );
      const response = MySQLClient.processRows(rows);
      if (response.length) {
        connection.release();
        return {
          status: 409,
          message: "CONFLICT: Already exists",
          data: response[0],
        };
      }
      connection.release();
      return { status: 404, message: "Email not found" };
    }
    return { status: 400, message: "Invalid email" };
  } catch (err) {
    return { status: 500, message: "Client connection error" };
  }
};
