from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from llama_index.legacy.llms.ollama import Ollama
import torch

app = FastAPI()

# Initialize the Ollama model
device = "cuda" if torch.cuda.is_available() else "cpu"
model = Ollama(model="llama3.1", device=device, batch_size=512 if device == "cuda" else 64)

class Question(BaseModel):
    text: str

@app.post("/api/get_answer")
async def get_answer(question: Question):
    if not model:
        raise HTTPException(status_code=700, detail="Ollama model is not initialized")
    
    try:
        response = model.complete(question.text)
        return {"answer": response.text}
    except Exception as e:
        raise HTTPException(status_code=600, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000,timeout=60000)