import { ClickHouseClient, createClient } from "@clickhouse/client";

let client: ClickHouseClient;
export const chClient = () => {
  if (client !== undefined) {
    return client;
  }
  client = createClient({
    host: process.env.CLICKHOUSE_HOST ?? "http://localhost:8123",
    username: process.env.CLICKHOUSE_USER ?? "default",
    password: process.env.CLICKHOUSE_PASSWORD ?? "",
  });
  return client;
};
