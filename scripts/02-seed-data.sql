-- Seed data for IOCL Trainee Management System

-- Insert roles
INSERT INTO roles (name, description) VALUES
('Admin', 'System Administrator'),
('L&D Coordinator', 'Learning & Development Coordinator'),
('L&D HoD', 'Learning & Development Head of Department'),
('Department HoD', 'Department Head of Department'),
('Mentor', 'Trainee Mentor'),
('Employee', 'Regular Employee');

-- Insert departments
INSERT INTO departments (name, code, description) VALUES
('Learning & Development', 'L&D', 'Learning and Development Department'),
('Information Technology', 'IT', 'Information Technology Department'),
('Human Resources', 'HR', 'Human Resources Department'),
('Operations', 'OPS', 'Operations Department'),
('Engineering', 'ENG', 'Engineering Department'),
('Research & Development', 'R&D', 'Research and Development Department');

-- Insert sample users
INSERT INTO users (employee_id, first_name, last_name, email, password, role_id, department_id) VALUES
('ADMIN001', 'System', 'Administrator', 'admin@iocl.co.in', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9u2', 1, NULL),
('EMP001', 'Rajesh', 'Kumar', 'rajesh.kumar@iocl.co.in', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 2, 1),
('EMP002', 'Priya', 'Sharma', 'priya.sharma@iocl.co.in', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 3, 1),
('EMP003', 'Amit', 'Singh', 'amit.singh@iocl.co.in', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 4, 2),
('EMP004', 'Vikram', 'Gupta', 'vikram.gupta@iocl.co.in', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 5, 2),
('EMP005', 'Meera', 'Joshi', 'meera.joshi@iocl.co.in', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 5, 4),
('EMP006', 'Kavita', 'Nair', 'kavita.nair@iocl.co.in', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 5, 5);

-- Update departments with HoD assignments
UPDATE departments SET hod_user_id = 1 WHERE department_code = 'L&D';
UPDATE departments SET hod_user_id = 3 WHERE department_code = 'IT';
UPDATE departments SET hod_user_id = 4 WHERE department_code = 'HR';
UPDATE departments SET hod_user_id = 7 WHERE department_code = 'FIN';

-- Insert sample internship requests
INSERT INTO internship_requests (request_number, requested_by, trainee_name, trainee_email, trainee_phone, institution_name, course_details, internship_duration, preferred_department, request_description, status) VALUES
('REQ001', 2, 'Arjun Reddy', 'arjun.reddy@student.edu', '+91-8765432109', 'IIT Delhi', 'Computer Science Engineering', 60, 2, 'Summer internship in software development', 'SUBMITTED'),
('REQ002', 2, 'Sneha Agarwal', 'sneha.agarwal@student.edu', '+91-8765432108', 'NIT Trichy', 'Information Technology', 90, 2, 'Internship in data analytics and AI', 'UNDER_REVIEW'),
('REQ003', 2, 'Rohit Sharma', 'rohit.sharma@student.edu', '+91-8765432107', 'BITS Pilani', 'Mechanical Engineering', 120, 6, 'Industrial training in operations', 'MENTOR_ASSIGNED');

-- Insert sample mentor assignments
INSERT INTO mentor_assignments (request_id, mentor_id, assigned_by, assignment_date, start_date, end_date) VALUES
(3, 8, 3, CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '127 days');

-- Insert sample approvals
INSERT INTO approvals (request_id, approver_id, approval_type, approval_status, comments) VALUES
(1, 1, 'INTERNSHIP_APPROVAL', 'PENDING', 'Initial review pending'),
(2, 1, 'INTERNSHIP_APPROVAL', 'PENDING', 'Under technical evaluation'),
(3, 3, 'MENTOR_ASSIGNMENT', 'APPROVED', 'Mentor assigned successfully');

-- Insert system configuration
INSERT INTO system_config (key, value, description) VALUES
('MAX_MENTOR_CAPACITY', '3', 'Maximum number of trainees per mentor'),
('AUTO_APPROVAL_THRESHOLD', '30', 'Auto-approval threshold in days'),
('EMAIL_NOTIFICATIONS_ENABLED', 'true', 'Enable email notifications'),
('SMS_NOTIFICATIONS_ENABLED', 'true', 'Enable SMS notifications'),
('FILE_UPLOAD_MAX_SIZE', '10485760', 'Maximum file upload size in bytes (10MB)');
