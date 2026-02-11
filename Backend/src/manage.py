import asyncio
import typer
import logging
import sys
from sqlalchemy import select

# Add current directory to path so imports work
sys.path.append(".")

from core.config import settings
from core.database import AsyncSessionLocal, engine
from models.user import User
from auth.password import hash_password

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = typer.Typer()

async def get_session_context():
    async with AsyncSessionLocal() as session:
        yield session
    # We dispose the global engine at the end of the script run if needed,
    # but for a single command, we can just let it be or explictly dispose in the command.

@app.command(name="create-admin")
def create_admin(
    email: str = typer.Option(..., prompt=True),
    password: str = typer.Option(..., prompt=True, hide_input=True, confirmation_prompt=True),
    name: str = typer.Option(..., prompt=True)
):
    """Create admin user"""
    
    async def _create_admin():
        try:
            async with AsyncSessionLocal() as session:
                # Check if user exists
                result = await session.execute(select(User).where(User.email == email))
                existing_user = result.scalar_one_or_none()
                
                if existing_user:
                    typer.echo(f"User with email {email} already exists")
                    return # Exit if user exists
                
                hashed = hash_password(password)
                
                new_admin = User(
                    email=email,
                    hashed_password=hashed,
                    full_name=name, 
                    role="admin"
                )

                session.add(new_admin)
                await session.commit()
                
                typer.echo(f"Admin user {email} created successfully")
                logger.info(f"Admin user {email} created successfully")

        except Exception as e:
            typer.echo(f"Failed to create admin user: {e}")
            logger.error(f"Error creating admin: {e}")
        finally:
            # Dispose the engine to close connections cleanly before event loop closes
            await engine.dispose()
    
    asyncio.run(_create_admin())

@app.command()
def ping():
    """Ping the database"""
    async def _ping():
        try:
            async with AsyncSessionLocal() as session:
                await session.execute(select(1))
                typer.echo("Pong!")
        except Exception as e:
             typer.echo(f"Ping failed: {e}")
        finally:
            await engine.dispose()

    asyncio.run(_ping())

if __name__ == "__main__":
    app()

