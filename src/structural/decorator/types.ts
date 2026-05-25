export interface Request {
  token?: string;
}

export type Handler = (req: Request) => void;
