import { DEBUG } from "./config.ts";
import { setProjectIconFromTitle } from "./set_task_icon.ts";

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const pageId = body.data?.id;

    if (!pageId) {
      console.error("❌ Missing pageId in webhook payload:", JSON.stringify(body, null, 2));
      return new Response("Bad Request: Missing pageId", { status: 400 });
    }

    if (DEBUG) console.log("📩 Webhook received for page ID:", pageId);

    await setProjectIconFromTitle(pageId, fullTitle);

    return new Response("✅ Icon updated, and Notion update is complete", { status: 200 });
  } catch (e) {
    console.error("🔥 Error in webhook handler:");
    console.error(e?.message || e);
    if (e?.stack) console.error(e.stack);
    return new Response("Internal Server Error", { status: 500 });
  }
});
