import os
import json
from typing import Dict, List, Optional, Any
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import logging

logger = logging.getLogger(__name__)

class GoogleDriveService:
    """Service for Google Drive integration"""
    
    def __init__(self):
        self.credentials_file = os.getenv('GOOGLE_CREDENTIALS_FILE', 'credentials.json')
        self.scopes = [
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/documents'
        ]
        self.service = None
        self.docs_service = None
    
    async def authenticate(self, auth_code: str) -> Dict[str, Any]:
        """Authenticate with Google Drive using OAuth2 flow"""
        try:
            # Create flow from credentials file
            flow = Flow.from_client_secrets_file(
                self.credentials_file,
                scopes=self.scopes,
                redirect_uri='http://localhost:3000/auth/callback'
            )
            
            # Exchange authorization code for credentials
            flow.fetch_token(code=auth_code)
            credentials = flow.credentials
            
            # Build services
            self.service = build('drive', 'v3', credentials=credentials)
            self.docs_service = build('docs', 'v1', credentials=credentials)
            
            return {
                'access_token': credentials.token,
                'refresh_token': credentials.refresh_token,
                'expires_in': credentials.expiry.timestamp() if credentials.expiry else None
            }
            
        except Exception as e:
            logger.error(f"Error authenticating with Google Drive: {str(e)}")
            raise e
    
    async def save_resume_as_doc(self, resume_content: str, file_name: str) -> str:
        """Save resume content as Google Docs file"""
        try:
            if not self.docs_service:
                raise ValueError("Google Docs service not initialized")
            
            # Create a new Google Doc
            doc = {
                'title': file_name
            }
            
            # Create the document
            document = self.docs_service.documents().create(body=doc).execute()
            document_id = document.get('documentId')
            
            # Insert resume content
            requests = [
                {
                    'insertText': {
                        'location': {
                            'index': 1,
                        },
                        'text': resume_content
                    }
                }
            ]
            
            # Execute the batch update
            self.docs_service.documents().batchUpdate(
                documentId=document_id,
                body={'requests': requests}
            ).execute()
            
            logger.info(f"Resume saved to Google Docs: {document_id}")
            return document_id
            
        except HttpError as e:
            logger.error(f"Google API error: {str(e)}")
            raise e
        except Exception as e:
            logger.error(f"Error saving resume to Google Docs: {str(e)}")
            raise e
    
    async def list_resume_files(self) -> List[Dict[str, Any]]:
        """List all resume files in Google Drive"""
        try:
            if not self.service:
                raise ValueError("Google Drive service not initialized")
            
            # Search for documents with "resume" in the name
            query = "name contains 'resume' and mimeType='application/vnd.google-apps.document'"
            
            results = self.service.files().list(
                q=query,
                pageSize=20,
                fields="nextPageToken, files(id, name, modifiedTime, webViewLink)"
            ).execute()
            
            files = results.get('files', [])
            
            return [
                {
                    'id': file['id'],
                    'name': file['name'],
                    'modified_time': file['modifiedTime'],
                    'url': file['webViewLink']
                }
                for file in files
            ]
            
        except HttpError as e:
            logger.error(f"Google API error: {str(e)}")
            raise e
        except Exception as e:
            logger.error(f"Error listing resume files: {str(e)}")
            raise e
    
    async def update_resume_content(self, document_id: str, new_content: str) -> bool:
        """Update existing Google Docs resume with new content"""
        try:
            if not self.docs_service:
                raise ValueError("Google Docs service not initialized")
            
            # Get current document content
            document = self.docs_service.documents().get(documentId=document_id).execute()
            
            # Clear existing content and insert new content
            requests = [
                {
                    'deleteContentRange': {
                        'range': {
                            'startIndex': 1,
                            'endIndex': len(document.get('body', {}).get('content', [{}])[0].get('paragraph', {}).get('elements', [{}])[0].get('textRun', {}).get('content', ''))
                        }
                    }
                },
                {
                    'insertText': {
                        'location': {
                            'index': 1,
                        },
                        'text': new_content
                    }
                }
            ]
            
            # Execute the batch update
            self.docs_service.documents().batchUpdate(
                documentId=document_id,
                body={'requests': requests}
            ).execute()
            
            logger.info(f"Resume content updated: {document_id}")
            return True
            
        except HttpError as e:
            logger.error(f"Google API error: {str(e)}")
            raise e
        except Exception as e:
            logger.error(f"Error updating resume content: {str(e)}")
            raise e
    
    async def create_resume_from_template(self, template_id: str, resume_data: Dict[str, Any]) -> str:
        """Create a new resume from a Google Docs template"""
        try:
            if not self.service or not self.docs_service:
                raise ValueError("Google services not initialized")
            
            # Copy the template
            copy_request = {
                'name': f"Resume - {resume_data.get('name', 'Untitled')}"
            }
            
            copied_file = self.service.files().copy(
                fileId=template_id,
                body=copy_request
            ).execute()
            
            document_id = copied_file.get('id')
            
            # Replace placeholders with actual data
            requests = []
            
            # Replace common placeholders
            replacements = {
                '{{NAME}}': resume_data.get('personal', {}).get('name', ''),
                '{{EMAIL}}': resume_data.get('personal', {}).get('email', ''),
                '{{PHONE}}': resume_data.get('personal', {}).get('phone', ''),
                '{{LOCATION}}': resume_data.get('personal', {}).get('location', ''),
                '{{SUMMARY}}': resume_data.get('summary', ''),
            }
            
            for placeholder, replacement in replacements.items():
                requests.append({
                    'replaceAllText': {
                        'containsText': {
                            'text': placeholder,
                            'matchCase': True
                        },
                        'replaceText': replacement
                    }
                })
            
            # Execute replacements
            if requests:
                self.docs_service.documents().batchUpdate(
                    documentId=document_id,
                    body={'requests': requests}
                ).execute()
            
            logger.info(f"Resume created from template: {document_id}")
            return document_id
            
        except HttpError as e:
            logger.error(f"Google API error: {str(e)}")
            raise e
        except Exception as e:
            logger.error(f"Error creating resume from template: {str(e)}")
            raise e
