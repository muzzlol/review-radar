from pydantic import BaseSettings

class Settings(BaseSettings):
    openai_api_key: str
    fake_review_model_path: str = "models/fake_review_model.pkl"

    class Config:
        env_file = ".env"  # Loads variables from the .env file

settings = Settings()