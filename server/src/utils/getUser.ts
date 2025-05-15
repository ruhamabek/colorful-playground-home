import userCookieInterface from "../interface/userCookieInterface";
import { auth } from "../lib/auth";

export const getUser = async (req: any): Promise<userCookieInterface | null> => {
  try {
    console.log("Headers received:", req.headers);

    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    console.log("Session data:", session);

    const user = session?.user;
    if (!user || !user.id) {
      console.error("User not found in session");
      return null;
    }
    return user as userCookieInterface;
  } catch (error) {
    console.error("Failed to get user session:", error);
    return null;
  }
};
