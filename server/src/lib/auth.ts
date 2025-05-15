import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client } from "../db/mongo-client";

export const auth = betterAuth({
  database: mongodbAdapter(client.db("Kidcare")),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.OAUTH_CLIENT_ID!,
      clientSecret: process.env.OAUTH_CLIENT_SECRET!,
      // Add state parameter to include role selection
      generateState: (req: any) => {
        const role = req.body?.role || req.query?.role;
        if (!role) throw new Error("Role is required");

        const validRoles = ["parent", "nanny", "driver", "tutore"];
        if (!validRoles.includes(role)) {
          throw new Error(`Invalid role: ${role}`);
        }

        return { role };
      },
      // Use the state to set the role
      onUserCreated: async (user: any, state: any) => {
        if (!state?.role) throw new Error("Role not provided");
        user.role = state.role;
        return user;
      },
    },
  },

  trustedOrigins: ["http://localhost:8080"],

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        input: true,
        validate: (value: string) => {
          const validRoles = ["parent", "nanny", "driver", "tutore"];
          if (!validRoles.includes(value)) {
            throw new Error(`Invalid role: ${value}`);
          }
        },
      },
    },
  },
});
