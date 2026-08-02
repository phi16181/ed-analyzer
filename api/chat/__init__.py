import json
import os
import logging
import requests
from datetime import datetime, timezone
import azure.functions as func
from openai import AzureOpenAI

def fetch_ed_threads(ed_token: str, course_id: str, start_date: str, end_date: str):
    """Fetch threads from Ed API and filter by date range"""
    headers = {"Authorization": f"Bearer {ed_token}"}
    
    # Fetch threads from Ed API
    url = f"https://us.edstem.org/api/courses/{course_id}/threads"
    params = {"limit": 100, "sort": "new"}
    
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    data = response.json()
    
    threads = data.get("threads", [])
    
    # Parse date range
    start_dt = datetime.fromisoformat(start_date).replace(tzinfo=timezone.utc)
    end_dt = datetime.fromisoformat(end_date).replace(tzinfo=timezone.utc)
    
    # Filter by date and extract content
    filtered = []
    for thread in threads:
        created = thread.get("created_at", "")
        if not created:
            continue
        try:
            thread_dt = datetime.fromisoformat(created.replace("Z", "+00:00"))
            if start_dt <= thread_dt <= end_dt:
                filtered.append(thread)
        except ValueError:
            continue
    
    return filtered

def extract_content(thread: dict) -> str:
    """Extract readable text from a thread"""
    parts = []
    parts.append(f"Title: {thread.get('title', 'Untitled')}")
    parts.append(f"Type: {thread.get('type', 'post')}")
    
    category = thread.get("category", "")
    if category:
        parts.append(f"Category: {category}")
    
    user = thread.get("user", {})
    author = user.get("name", "Unknown") if user else "Unknown"
    parts.append(f"Author: {author}")
    
    # Main content - Ed uses a document field with HTML
    content = thread.get("content", thread.get("document", ""))
    if content:
        # Strip basic HTML tags
        import re
        content = re.sub(r"<[^>]+>", " ", content).strip()
        content = re.sub(r"\s+", " ", content)
        if content:
            parts.append(f"Content: {content[:1000]}")
    
    # Comments
    comments = thread.get("comments", [])
    if comments:
        parts.append(f"Replies ({len(comments)}):")
        for i, c in enumerate(comments[:5]):  # cap at 5 replies per thread
            c_user = c.get("user", {})
            c_author = c_user.get("name", "Unknown") if c_user else "Unknown"
            c_text = c.get("content", "")
            if c_text:
                import re
                c_text = re.sub(r"<[^>]+>", " ", c_text).strip()
                c_text = re.sub(r"\s+", " ", c_text)[:500]
            if c_text:
                parts.append(f"  Reply {i+1} by {c_author}: {c_text}")
    
    return "\n".join(parts)

def main(req: func.HttpRequest) -> func.HttpResponse:
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if req.method == "OPTIONS":
        return func.HttpResponse(status_code=204, headers=cors_headers)

    try:
        body = req.get_json()
        system_prompt = body.get("systemPrompt", "")
        user_prompt   = body.get("userPrompt", "")
        ed_token      = body.get("edToken", "")
        course_id     = body.get("courseId", "")
        start_date    = body.get("startDate", "")
        end_date      = body.get("endDate", "")
        mode          = body.get("mode", "qa")  # "summary" | "tone" | "qa"

        if not system_prompt:
            return func.HttpResponse(
                json.dumps({"error": "Missing systemPrompt"}),
                status_code=400, mimetype="application/json", headers=cors_headers
            )

        # For summary and tone: fetch real Ed threads and build context
        thread_context = ""
        thread_count = 0

        if mode in ("summary", "tone") and ed_token and course_id and start_date and end_date:
            try:
                threads = fetch_ed_threads(ed_token, course_id, start_date, end_date)
                thread_count = len(threads)
                if threads:
                    contents = [extract_content(t) for t in threads]
                    thread_context = "\n\n" + ("=" * 50 + "\n\n").join(contents)
                else:
                    thread_context = "No threads found in this date range."
            except requests.HTTPError as e:
                if e.response.status_code == 401:
                    return func.HttpResponse(
                        json.dumps({"error": "Ed API token is invalid or expired. Please check your token."}),
                        status_code=401, mimetype="application/json", headers=cors_headers
                    )
                raise

        # Build the final prompt with real content injected
        if thread_context:
            final_user_prompt = user_prompt + f"\n\nHere is the actual discussion content ({thread_count} threads):\n\n{thread_context}"
        else:
            final_user_prompt = user_prompt  # Q&A uses context already in the prompt

        client = AzureOpenAI(
            api_key=os.environ["AZURE_OPENAI_KEY"],
            azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
            api_version="2024-02-01"
        )

        response = client.chat.completions.create(
            model=os.environ["AZURE_OPENAI_DEPLOYMENT"],
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": final_user_prompt},
            ]
        )

        result = response.choices[0].message.content

        return func.HttpResponse(
            json.dumps({"result": result, "threadCount": thread_count}),
            status_code=200, mimetype="application/json", headers=cors_headers
        )

    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500, mimetype="application/json", headers=cors_headers
        )
