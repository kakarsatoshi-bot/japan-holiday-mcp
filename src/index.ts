import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { withLogging } from "./utils/logger";

import { pingToolDefinition, handlePing } from "./tools/ping";
import { isHolidayToolDefinition, handleIsHoliday } from "./tools/is_holiday";
import {
  getHolidaysInMonthToolDefinition,
  handleGetHolidaysInMonth,
} from "./tools/get_holidays_in_month";
import {
  getNextHolidaysToolDefinition,
  handleGetNextHolidays,
} from "./tools/get_next_holidays";

export interface Env {
  JapanHolidayMcpAgent: DurableObjectNamespace;
}

export class JapanHolidayMcpAgent extends McpAgent<Env> {
  server = new McpServer({
    name: "japan-holiday-mcp",
    version: "1.0.0",
  });

  async init() {
    // ── Tool 1: ping ──────────────────────────────────────────
    this.server.registerTool(
      pingToolDefinition.name,
      {
        description: pingToolDefinition.description,
        inputSchema: { message: z.string().optional() },
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
      },
      async ({ message }) => ({
        content: [
          {
            type: "text",
            text: await withLogging("ping", { message }, () =>
              handlePing({ message })
            ),
          },
        ],
      })
    );

    // ── Tool 2: is_holiday ────────────────────────────────────
    this.server.registerTool(
      isHolidayToolDefinition.name,
      {
        description: isHolidayToolDefinition.description,
        inputSchema: {
          date: z
            .string()
            .describe("Date to check in YYYY-MM-DD format (e.g. '2026-01-01')"),
        },
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: true,
        },
      },
      async ({ date }) => ({
        content: [
          {
            type: "text",
            text: await withLogging("is_holiday", { date }, () =>
              handleIsHoliday({ date })
            ),
          },
        ],
      })
    );

    // ── Tool 3: get_holidays_in_month ─────────────────────────
    this.server.registerTool(
      getHolidaysInMonthToolDefinition.name,
      {
        description: getHolidaysInMonthToolDefinition.description,
        inputSchema: {
          year: z.number().describe("Year (e.g. 2026)"),
          month: z.number().describe("Month as a number 1–12"),
        },
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: true,
        },
      },
      async ({ year, month }) => ({
        content: [
          {
            type: "text",
            text: await withLogging("get_holidays_in_month", { year, month }, () =>
              handleGetHolidaysInMonth({ year, month })
            ),
          },
        ],
      })
    );

    // ── Tool 4: get_next_holidays ─────────────────────────────
    this.server.registerTool(
      getNextHolidaysToolDefinition.name,
      {
        description: getNextHolidaysToolDefinition.description,
        inputSchema: {
          count: z
            .number()
            .optional()
            .describe("Number of upcoming holidays to return (default: 3)"),
        },
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: false,
          openWorldHint: true,
        },
      },
      async ({ count }) => ({
        content: [
          {
            type: "text",
            text: await withLogging("get_next_holidays", { count }, () =>
              handleGetNextHolidays({ count })
            ),
          },
        ],
      })
    );
  }
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return new Response(
        JSON.stringify({
          status: "ok",
          server: "japan-holiday-mcp",
          version: "1.0.0",
          timestamp: new Date().toISOString(),
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    if (url.pathname === "/mcp") {
      return JapanHolidayMcpAgent.serve("/mcp").fetch(request, env, ctx);
    }

    return new Response(
      JSON.stringify({
        name: "Japan Holiday MCP",
        description:
          "Japanese national holiday information via Cabinet Office official data",
        mcp_endpoint: "/mcp",
        health_endpoint: "/health",
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  },
} satisfies ExportedHandler<Env>;
