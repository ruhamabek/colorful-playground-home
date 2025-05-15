// auth.ts

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
    },
  },

  trustedOrigins: ["http://localhost:8080"],

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        input: true, // allow user to choose their role
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
