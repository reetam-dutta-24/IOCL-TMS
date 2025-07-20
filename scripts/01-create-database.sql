-- Create database and tables for IOCL Trainee Management System

-- Create database
CREATE DATABASE iocl_tms;

-- Connect to the database
\c iocl_tms;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
CREATE TYPE request_status_enum AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'MENTOR_ASSIGNED', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE priority_enum AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE assignment_status_enum AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');
CREATE TYPE approval_type AS ENUM (
  'MENTOR_ASSIGNMENT',
  'INTERNSHIP_APPROVAL', 
  'CLOSURE_APPROVAL'
);
CREATE TYPE approval_status_enum AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE report_type_enum AS ENUM ('WEEKLY', 'MONTHLY', 'FINAL', 'EVALUATION');
CREATE TYPE report_status_enum AS ENUM ('SUBMITTED', 'REVIEWED', 'APPROVED', 'NEEDS_REVISION');
CREATE TYPE letter_type_enum AS ENUM ('OFFER', 'COMPLETION', 'RECOMMENDATION', 'NOC');
CREATE TYPE notification_type_enum AS ENUM ('EMAIL', 'SMS', 'IN_APP', 'PUSH');

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT,
    permissions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) UNIQUE NOT NULL,
    department_code VARCHAR(10) UNIQUE NOT NULL,
    hod_user_id INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    department_id INTEGER,
    role_id INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(department_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- Update departments table to reference users
ALTER TABLE departments ADD CONSTRAINT fk_departments_hod 
FOREIGN KEY (hod_user_id) REFERENCES users(user_id);

-- Internship requests table
CREATE TABLE IF NOT EXISTS internship_requests (
    request_id SERIAL PRIMARY KEY,
    request_number VARCHAR(20) UNIQUE NOT NULL,
    requested_by INTEGER NOT NULL,
    trainee_name VARCHAR(100) NOT NULL,
    trainee_email VARCHAR(100),
    trainee_phone VARCHAR(15),
    institution_name VARCHAR(200),
    course_details TEXT,
    internship_duration INTEGER,
    preferred_department INTEGER,
    request_description TEXT,
    status request_status_enum DEFAULT 'SUBMITTED',
    priority priority_enum DEFAULT 'MEDIUM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requested_by) REFERENCES users(user_id),
    FOREIGN KEY (preferred_department) REFERENCES departments(department_id)
);

-- Mentor assignments table
CREATE TABLE IF NOT EXISTS mentor_assignments (
    assignment_id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL,
    mentor_id INTEGER NOT NULL,
    assigned_by INTEGER NOT NULL,
    assignment_date DATE NOT NULL,
    start_date DATE,
    end_date DATE,
    assignment_status assignment_status_enum DEFAULT 'ACTIVE',
    assignment_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES internship_requests(request_id),
    FOREIGN KEY (mentor_id) REFERENCES users(user_id),
    FOREIGN KEY (assigned_by) REFERENCES users(user_id)
);

-- Approvals table
CREATE TABLE IF NOT EXISTS approvals (
    approval_id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL,
    approver_id INTEGER NOT NULL,
    approval_type approval_type,
    approval_status approval_status_enum DEFAULT 'PENDING',
    approval_date TIMESTAMP,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES internship_requests(request_id),
    FOREIGN KEY (approver_id) REFERENCES users(user_id)
);

-- Project reports table
CREATE TABLE IF NOT EXISTS project_reports (
    report_id SERIAL PRIMARY KEY,
    assignment_id INTEGER NOT NULL,
    report_type report_type_enum,
    report_title VARCHAR(200),
    report_content TEXT,
    performance_rating INTEGER CHECK (performance_rating >= 1 AND performance_rating <= 5),
    behavioral_comments TEXT,
    technical_skills TEXT,
    areas_of_improvement TEXT,
    submitted_by INTEGER NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    report_status report_status_enum DEFAULT 'SUBMITTED',
    FOREIGN KEY (assignment_id) REFERENCES mentor_assignments(assignment_id),
    FOREIGN KEY (submitted_by) REFERENCES users(user_id)
);

-- Letters table
CREATE TABLE IF NOT EXISTS letters (
    letter_id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL,
    letter_type letter_type_enum,
    letter_number VARCHAR(50) UNIQUE NOT NULL,
    letter_content TEXT,
    generated_by INTEGER NOT NULL,
    generated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_signed BOOLEAN DEFAULT FALSE,
    signed_by INTEGER,
    signed_date TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES internship_requests(request_id),
    FOREIGN KEY (generated_by) REFERENCES users(user_id),
    FOREIGN KEY (signed_by) REFERENCES users(user_id)
);

-- Document attachments table
CREATE TABLE IF NOT EXISTS document_attachments (
    attachment_id SERIAL PRIMARY KEY,
    request_id INTEGER,
    report_id INTEGER,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(50),
    uploaded_by INTEGER NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES internship_requests(request_id),
    FOREIGN KEY (report_id) REFERENCES project_reports(report_id),
    FOREIGN KEY (uploaded_by) REFERENCES users(user_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    notification_type notification_type_enum,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_sent BOOLEAN DEFAULT FALSE,
    priority priority_enum DEFAULT 'MEDIUM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP,
    read_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Audit trail table
CREATE TABLE IF NOT EXISTS audit_trail (
    audit_id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(10) CHECK (action IN ('CREATE', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    changed_by INTEGER NOT NULL,
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    FOREIGN KEY (changed_by) REFERENCES users(user_id)
);

-- System configuration table
CREATE TABLE IF NOT EXISTS system_config (
    config_id SERIAL PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT,
    config_description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
