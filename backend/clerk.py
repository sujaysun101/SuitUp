# clerk.py
# Simple Clerk server SDK wrapper for FastAPI backend
import requests

class ClerkClient:
    def __init__(self, secret_key):
        self.secret_key = secret_key
        self.base_url = "https://api.clerk.com/v1"
        self.headers = {
            "Authorization": f"Bearer {self.secret_key}",
            "Content-Type": "application/json"
        }

    def users(self):
        return self

    def get_user(self, user_id):
        resp = requests.get(f"{self.base_url}/users/{user_id}", headers=self.headers)
        resp.raise_for_status()
        return ClerkUser(self, resp.json())

class ClerkUser:
    def __init__(self, client, data):
        self.client = client
        self.data = data
        self.id = data["id"]
        self.public_metadata = data.get("public_metadata", {})

    def save(self):
        resp = requests.patch(
            f"{self.client.base_url}/users/{self.id}",
            headers=self.client.headers,
            json={"public_metadata": self.public_metadata}
        )
        resp.raise_for_status()
        self.data = resp.json()
        return self
