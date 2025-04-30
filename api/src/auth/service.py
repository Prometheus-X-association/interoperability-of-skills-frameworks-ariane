from datetime import datetime, timedelta, timezone
from typing import Annotated, Any, Literal
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from .model import Token
from ..user.service import UserService
from src.config import settings


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class AuthService:
    def __init__(self, user_service: UserService) -> None:
        self.user_service = user_service

    async def authenticate(self, username: str, password: str) -> Token | Literal[False]:
        user = await self.user_service.find_user_by_username(username)
        if not user:
            return False

        is_password_valid = self.user_service.verify_password(password, user.password)
        if not is_password_valid:
            return False
        
        access_token = await self.create_jwt(
            data = {"sub": user.username, "mindmatcher::role": user.role},
            expires_delta = timedelta(minutes=Token.__fields__["expires_in"].default)
        )
        
        response = Token(
            access_token = access_token,
            token_type = Token.__fields__["token_type"].default
        )
        return response

    async def create_jwt(self, data: dict, expires_delta: timedelta) -> str:
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + (expires_delta)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
        return encoded_jwt

    async def verify_jwt(self, token: Annotated[str, Depends(oauth2_scheme)]) -> str:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload: dict[str, Any] = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
            username = payload.get("sub")
            if username is None:
                raise credentials_exception
        except InvalidTokenError:
            raise credentials_exception
        
        return username
