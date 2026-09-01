from sqlalchemy import JSON, Boolean, Engine, Integer, inspect, text
from sqlalchemy.schema import MetaData


def _default_for(column) -> str:
    if isinstance(column.type, JSON):
        return "'[]'"
    if isinstance(column.type, Boolean):
        return "0"
    if isinstance(column.type, Integer):
        return "0"
    return "''"


def add_missing_columns(engine: Engine, metadata: MetaData) -> None:
    """Adds columns that exist on the ORM models but not yet in the DB table
    (e.g. after a schema change), and backfills them on existing rows so
    NOT-NULL-shaped Pydantic fields don't choke on NULL. Not a replacement
    for real migrations, just enough for this project's scale."""

    inspector = inspect(engine)

    with engine.begin() as conn:
        for table in metadata.sorted_tables:
            if not inspector.has_table(table.name):
                continue

            existing = {c["name"] for c in inspector.get_columns(table.name)}
            for column in table.columns:
                if column.name in existing:
                    continue

                col_type = column.type.compile(dialect=engine.dialect)
                conn.execute(text(f"ALTER TABLE {table.name} ADD COLUMN {column.name} {col_type}"))
                conn.execute(
                    text(
                        f"UPDATE {table.name} SET {column.name} = {_default_for(column)} "
                        f"WHERE {column.name} IS NULL"
                    )
                )
