# Notification System Design

## Overview
Simple Vehicle Maintenance Scheduler with Notification System using **MongoDB** database.

## What Was Built
- Reusable Logging Middleware
- Vehicle Maintenance Scheduler
- Notification Service
- MongoDB Integration

## Tech Stack
- Backend: Node.js / Express
- Database: **MongoDB**
- Logging: Custom Logging Middleware (integrated with AffordMed Test Server)

## Notification Types
- Upcoming Maintenance (within 7 days)
- Due Today
- Overdue

## Architecture
Scheduler → Fetch vehicles from MongoDB → Check due dates → Send Notification → Log every step

## Logging Strategy
All key operations are properly logged:

- Scheduler start
- Database operations
- Notification status
- Success / Error cases

**Example Logs:**
- `Log("backend", "info", "cron_job", "Daily maintenance check started")`
- `Log("backend", "info", "db", "Fetched vehicles from MongoDB")`
- `Log("backend", "warn", "notification", "Overdue vehicle found")`
- `Log("backend", "error", "service", "Failed to send notification")`

## Implementation Notes
- Used **MongoDB** to store vehicle maintenance data
- Simple cron simulation for scheduling
- Clean separation of Scheduler, Notification, and Logging layers
- Followed all logging constraints (stack, level, package)

## Limitations (Due to Time Constraint)
- No real email / SMS integration
- Basic notification simulation
- Limited error recovery

## Conclusion
Successfully implemented Logging Middleware with MongoDB integration and end-to-end notification flow.
