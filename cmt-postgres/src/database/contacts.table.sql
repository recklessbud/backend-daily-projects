CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    phone INTEGER(255) NOT NULL,
    zip VARCHAR(255) NOT NULL
)