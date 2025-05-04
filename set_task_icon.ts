import { NOTION_TOKEN, DEBUG } from "./config.ts";

const DEFAULT_IMAGE = "https://em-content.zobj.net/source/apple/118/white-heavy-check-mark_2705.png";

export async function setProjectIcon(pageId: string, retry = 0): Promise<void> {
  try {
    if (DEBUG) console.log("📌 Setting default project icon...");

    const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${NOTION_TOKEN}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
      },
      body: JSON.stringify({
        icon: {
          type: "external",
          external: { url: DEFAULT_IMAGE }
        }
      })
    });

    if (res.status === 409 && retry < 1) {
      if (DEBUG) console.warn("⚠️ Conflict occurred while saving icon. Retrying...");
      await new Promise(resolve => setTimeout(resolve, 500)); // wait 500ms
      return await setProjectIcon(pageId, retry + 1);
    }

    if (!res.ok) {
      const errText = await res.text();
      console.error("❌ Failed to update page icon:", errText);
      throw new Error("Icon update failed");
    }

    if (DEBUG) console.log("✅ Default icon applied to page.");
  } catch (err) {
    console.error("🔥 Error setting icon:", err?.message || err);
    if (err?.stack) console.error(err.stack);
  }
}
