from fastapi import APIRouter, Request
from pydantic import BaseModel
from typing import Any

router = APIRouter()

class SuggestionRequest(BaseModel):
    doc_id: str
    suggestions: list  # List of suggestion dicts from LLM

class SuggestionActionRequest(BaseModel):
    doc_id: str
    suggestion_ids: list
    action: str  # 'accept' or 'undo'

@router.post("/api/docs/suggest")
async def suggest_edits(data: SuggestionRequest):
    # TODO: Use Google Docs API to insert suggestions in suggestion mode
    # Return suggestion IDs for later accept/undo
    return {"status": "suggested", "suggestion_ids": ["sugg1", "sugg2"]}

@router.post("/api/docs/suggestion-action")
async def suggestion_action(data: SuggestionActionRequest):
    # TODO: Use Google Docs API to accept or undo suggestions
    return {"status": data.action, "suggestion_ids": data.suggestion_ids}
