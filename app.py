import streamlit as st
from llama_index.legacy.llms.ollama import Ollama
import time
import requests
import torch

# Check if GPU is available and set device
device = "cuda" if torch.cuda.is_available() else "cpu"
st.info(f"Using device: {device}")

# Initialize the Ollama model with optimized settings for GPU usage
model = None

try:
    if device == "cuda":
        # Increased batch size and reduced timeout for GPU, increased num_gpu
        model = Ollama(model="llama3.1", timeout=15, device=device,
                       batch_size=512, num_gpu=torch.cuda.device_count())
        st.success(
            f"Ollama model initialized successfully on GPU with batch size 512 and {torch.cuda.device_count()} GPU(s)")
    else:
        # Fallback to CPU with lower batch size
        model = Ollama(model="llama3.1", timeout=30,
                       device="cpu", batch_size=64)
        st.warning(
            "Ollama model initialized on CPU. For better performance, consider using a GPU.")
except Exception as e:
    st.error(f"Error initializing Ollama model: {str(e)}")


def get_model_response(question):
    placeholder = st.empty()
    response_so_far = ""

    try:
        st.info(f"Sending question to model: {question}")
        start_time = time.time()

        # Adjust timeout based on device, reduced for GPU to push performance
        timeout = 120 if device == "cuda" else 480
        response = model.complete(question, timeout=timeout)

        end_time = time.time()
        st.success(
            f"Received response from model in {end_time - start_time:.2f} seconds")

        full_response = response.text

        # Display response incrementally with faster update
        for chunk in full_response.split():
            response_so_far += chunk + " "
            placeholder.write("Answer: " + response_so_far)
            time.sleep(0.005)  # Further reduced sleep time for faster updates
        return response_so_far.strip()

    except requests.exceptions.Timeout:
        st.error(
            "Request to Ollama model timed out. The server might be overloaded or the question might be too complex.")
        return "Error: Request timed out"
    except Exception as e:
        st.error(f"Error in get_model_response: {str(e)}")
        return f"Error: {str(e)}"


# Streamlit UI
st.title("Build Your Own LLM Model with Ollama")

# Input for the question
question = st.text_input("Enter your question:")

# When the button is pressed, run the model and display the result
if st.button("Get Answer"):
    if question:
        if model:  # Ensure model is initialized before calling
            with st.spinner("Getting answer..."):
                result = get_model_response(question)
            # st.write("Final answer:", result)
        else:
            st.error("Ollama model is not initialized. Please check your setup.")
    else:
        st.warning("Please enter a question.")
