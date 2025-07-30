
from fastapi import APIRouter, Request, Response
from fastapi.responses import RedirectResponse, JSONResponse
import os
import uuid
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

router = APIRouter()

# In-memory token store for demo (replace with DB/session in production)
user_tokens = {}

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "YOUR_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "YOUR_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/api/google/callback")
SCOPES = [
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/documents.readonly"
]

def get_flow(state=None):
    return Flow(
        client_type="web",
        client_config={
            "web": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uris": [GOOGLE_REDIRECT_URI],
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token"
            }
        },
        scopes=SCOPES,
        redirect_uri=GOOGLE_REDIRECT_URI,
        state=state
    )

@router.get("/api/google/auth")
async def google_auth():
    # Start OAuth flow
    state = str(uuid.uuid4())
    flow = get_flow(state)
    auth_url, _ = flow.authorization_url(prompt="consent", access_type="offline", include_granted_scopes="true")
    response = RedirectResponse(url=auth_url)
    response.set_cookie("google_oauth_state", state)
    return response

@router.get("/api/google/callback")
async def google_callback(request: Request):
    # Handle OAuth callback
    state = request.cookies.get("google_oauth_state")
    code = request.query_params.get("code")
    if not code:
        return JSONResponse({"error": "Missing code"}, status_code=400)
    flow = get_flow(state)
    flow.fetch_token(code=code)
    creds = flow.credentials
    # For demo: use a fake user_id (replace with real user session)
    user_id = "demo_user"
    user_tokens[user_id] = creds.to_json()
    return RedirectResponse(url="/dashboard?google_connected=1")

def get_user_creds(user_id):
    if user_id not in user_tokens:
        return None
    return Credentials.from_authorized_user_info(eval(user_tokens[user_id]))

@router.get("/api/google/docs")
async def list_google_docs(request: Request):
    # For demo: use fake user_id
    user_id = "demo_user"
    creds = get_user_creds(user_id)
    if not creds:
        return JSONResponse({"error": "Google account not connected"}, status_code=401)
    service = build('drive', 'v3', credentials=creds)
    results = service.files().list(q="mimeType='application/vnd.google-apps.document'", fields="files(id, name)").execute()
    docs = results.get('files', [])
    return {"docs": docs}

@router.get("/api/google/docs/{doc_id}")
async def get_doc(doc_id: str):
    # Return doc link (embed in iframe on frontend)
    return {"id": doc_id, "url": f"https://docs.google.com/document/d/{doc_id}/edit"}
