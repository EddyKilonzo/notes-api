CREATE DATABASE notebook;
CREATE TABLE notes (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL
);
Create INDEX idx_notes_title ON notes (title);
CREATE UNIQUE INDEX idx_notes_title_content ON notes (title, content);
