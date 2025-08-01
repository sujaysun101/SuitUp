from fastapi import APIRouter, Request, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
from clerk import ClerkClient

router = APIRouter()

class OnboardingCompleteRequest(BaseModel):
    user_id: str

@router.post("/api/mark-onboarding-complete")
async def mark_onboarding_complete(data: OnboardingCompleteRequest, request: Request):
    # Authenticate the request (add your own auth logic here)
    # For example, check a session or token
    # ...

    clerk_secret_key = os.environ.get("CLERK_SECRET_KEY")
    if not clerk_secret_key:
        raise HTTPException(status_code=500, detail="Clerk secret key not configured")

    clerk = ClerkClient(clerk_secret_key)
    try:
        user = clerk.users.get_user(data.user_id)
        user.public_metadata["onboardingComplete"] = True
        user.save()
        return JSONResponse({"success": True})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
