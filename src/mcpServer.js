import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { getServices, createAppointmentDeepLink } from "./services/igovttService.js";

export function mountMcpServer(app) {
  app.post("/mcp", async (req, res) => {
    const server = new McpServer({
      name: "igovtt-tools",
      version: "1.0.0"
    });

    server.registerTool(
      "listServices",
      {
        title: "List iGovTT appointment services",
        description:
          "Use this tool whenever a visitor asks to list available appointment services.",
        inputSchema: {}
      },
      async () => {
        const result = await getServices();

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result)
            }
          ]
        };
      }
    );

    server.registerTool(
      "createAppointmentDeepLink",
      {
        title: "Create appointment deeplink",
        description:
          "Use this tool when the visitor provides serviceId and branchId and wants an appointment booking link.",
        inputSchema: {
          serviceId: z.string(),
          branchId: z.string()
        }
      },
      async ({ serviceId, branchId }) => {
        const result = await createAppointmentDeepLink({ serviceId, branchId });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result)
            }
          ]
        };
      }
    );

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  });
}