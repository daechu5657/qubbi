export class ExceptionModel {
  source!: "server" | "mongoose" | "default";
  statusCode!: number;
  message!: string;
  path!: string;
  timestamp!: string;
}
