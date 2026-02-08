from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends
from auth.security import decode_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    return decode_token(token)