import { Handler, Request } from "./types";

export function withAuth(handler: Handler): Handler {
  return (req: Request) => {
    if (!req.token) {
      console.log("Unauthorized");

      return;
    }

    handler(req);
  };
}
