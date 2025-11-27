# Send Request Functionality

## Overview

The Send Request functionality replaces the contact option with a comprehensive trainee management system for L&D Coordinators. This allows them to select approved trainees and send their details to LND HODs for review and department assignment.

## Features

### For L&D Coordinators

1. **Send Request Page** (`/send-request`)
   - View all approved trainees
   - Filter by department and search by name/email/institution
   - Bulk select trainees for forwarding
   - Choose target department for assignment
   - Send complete trainee details to LND HOD

2. **Key Features**
   - Bulk selection of trainees
   - Department filtering
   - Detailed trainee information view
   - Instant notification to LND HOD
   - Progress tracking

### For LND HODs

1. **Dashboard Integration**
   - Forwarded trainee requests section
   - Review and approve/reject trainees
   - Department assignment capabilities
   - Complete trainee details view

2. **Workflow**
   - Receive notifications from L&D Coordinators
   - Review trainee applications
   - Approve for department assignment
   - Track approval status

## API Endpoints

### `/api/internships`
- **GET**: Fetch approved trainees with status filter
- **POST**: Create new internship application

### `/api/department`
- **GET**: Fetch all departments

### `/api/notifications/forward-to-lnd-hod`
- **POST**: Forward trainee details to LND HOD

### `/api/notifications/forwarded-student-details`
- **GET**: Fetch forwarded student details for LND HOD

## Database Schema

### `internshipApplication`
- Stores trainee application details
- Status tracking (PENDING, APPROVED, REJECTED)
- Department preferences

### `forwardedStudentDetails`
- Links notifications to forwarded trainee data
- Tracks forwarding status and approvals

### `notification`
- System notifications for forwarded requests
- Email notifications to LND HODs

## User Roles

### L&D Coordinator
- Access to Send Request page
- Can select and forward approved trainees
- View trainee details and department information

### LND HOD
- Receives forwarded trainee requests
- Can review and approve/reject trainees
- Assigns trainees to departments

## Navigation Updates

1. **Contact Page** (`/contact`)
   - Redirects L&D Coordinators to Send Request
   - Shows process flow and features
   - Provides access to Send Request portal

2. **Dashboard Layout**
   - Added "Send Request" navigation for L&D Coordinators
   - Integrated with existing dashboard structure

3. **Main Page**
   - Updated "Contact Us" link to "Send Request"

## Testing

Run the test script to verify functionality:

```bash
node test-send-request.js
```

This will test:
1. Fetching approved trainees
2. Fetching departments
3. Forwarding to LND HOD

## Workflow Example

1. **L&D Coordinator** logs in and navigates to "Send Request"
2. **Selects approved trainees** from the list
3. **Chooses target department** for assignment
4. **Sends request** to LND HOD
5. **LND HOD** receives notification and reviews trainees
6. **LND HOD** approves/rejects trainees for department assignment
7. **System** tracks the entire process

## Benefits

- **Streamlined Process**: Direct trainee selection and forwarding
- **Department Coordination**: Clear department assignment workflow
- **Transparency**: Complete trainee details available for review
- **Efficiency**: Bulk operations and instant notifications
- **Tracking**: Full audit trail of forwarded requests

## Security

- Role-based access control
- Authentication required for all operations
- Validation of user permissions
- Secure API endpoints with proper error handling 