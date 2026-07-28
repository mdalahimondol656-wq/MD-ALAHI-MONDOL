from database import SessionLocal, Base, engine


def seed_data():
    db = SessionLocal()
    try:
        Base.metadata.create_all(bind=engine)
    finally:
        db.close()
