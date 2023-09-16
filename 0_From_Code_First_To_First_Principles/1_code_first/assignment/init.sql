CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

INSERT INTO users (id, email, username, firstName, lastName, password) VALUES 
(1, 'admin@test.com', 'admin', 'Al', 'Adm', 'Adm_P123'),
(2, 'test@test.com', 'test', 'Ts', 'Et', 'Tst_P123');