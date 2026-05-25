-- Run this in MySQL before starting the app

CREATE DATABASE IF NOT EXISTS tododb
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tododb;

-- Spring Boot with ddl-auto=update will auto-create the tables.
-- But you can also create them manually here:

CREATE TABLE IF NOT EXISTS projects (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    color       VARCHAR(20)  NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS todos (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    completed   BOOLEAN DEFAULT FALSE,
    priority    ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM',
    due_date    DATETIME,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    project_id  BIGINT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
