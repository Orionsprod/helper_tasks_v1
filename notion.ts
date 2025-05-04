import { NOTION_TOKEN, DEBUG } from "./config.ts";

const NOTION_VERSION = "2022-06-28";
const BASE_URL = "https://api.notion.com/v1";

const PROJECTS_DATABASE_ID = Deno.env.get("TASKS_DATABASE_ID")!;

export async function getPageTitleWithPrefix(pageId: string): Promise<string | null> {
  const pageRes = await fetch(`${BASE_URL}/pages/${pageId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${NOTION_TOKEN}`,
      "Notion-Version": NOTION_VERSION,
    },
  });

  const pageData = await pageRes.json();

  if (!pageRes.ok) {
    console.error("❌ Failed to fetch Notion page:", pageData);
    throw new Error("Notion API Error");
  }
