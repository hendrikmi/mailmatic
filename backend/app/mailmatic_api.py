from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from mailmatic import notes_to_email

app = FastAPI()
MAX_INPUT_LENGTH = 300

# Wrap FastAPI into a handler for Lambda
handler = Mangum(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/notes_to_email")
async def notes_to_email_api(notes: str):
    validate_input_length(notes)
    email = notes_to_email(notes)
    return {"email": email}


def validate_input_length(notes: str):
    if len(notes) >= MAX_INPUT_LENGTH:
        raise HTTPException(
            status_code=400,
            detail=f"Input length is too long. Must be under {MAX_INPUT_LENGTH} characters.",
        )


# uvicorn mailmatic_api:app --reload
