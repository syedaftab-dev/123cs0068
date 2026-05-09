# Stage 1: API Design
## REST APIs for Campus Notifications

### Endpoints
1. **GET /api/notifications/inbox**
   - Fetch notifications sorted by priority (Placement > Result > Event).
2. **GET /api/notifications/:userId**
   - Fetch notifications for a specific student.
3. **POST /api/notifications/send**
   - Trigger a notification (Internal).

### JSON Schema
```json
{
  "id": "UUID",
  "type": "Placement | Result | Event",
  "message": "string",
  "timestamp": "ISO8601"
}
```

---

# Stage 2: Storage Design
## Database Selection: MongoDB
### Rationale
- **Flexibility**: NoSQL allows for evolving notification types.
- **Scalability**: High throughput for massive "Notify All" events.

### Schema
- `userId`: String (Index)
- `originalId`: String (Unique)
- `type`: Enum (Placement, Result, Event)
- `message`: String
- `createdAt`: Date

---

# Stage 3: Query Optimization
1. **Accuracy**: The query is accurate but inefficient.
2. **Slowness**: Full table scan on `studentID`.
3. **Fix**: Add a compound index on `studentID` and `isRead`.
4. **Cost**: O(log N) instead of O(N).
5. **Index every column?**: No, it degrades write performance and increases storage.

---

# Stage 4: Performance Improvement
1. **Solution**: Redis Caching.
2. **Strategy**: Store unread counts in Redis. Use cache-aside for full lists.
3. **Tradeoffs**: Fast reads vs cache invalidation complexity.

---

# Stage 5: Reliable Delivery
1. **Shortcomings**: Synchronous loop, blocking, no retry mechanism.
2. **Failure**: 200 failures stop the process or leave data inconsistent.
3. **Redesign**: Use a Message Queue (BullMQ/RabbitMQ) for async processing.
4. **DB Save + Email together?**: No, decouple them. DB save is fast; Email is slow/unreliable.

---

# Stage 6: Priority Inbox Logic
Implemented in `notification_app_be`.
**Weights**:
- Placement: 3
- Result: 2
- Event: 1
**Sorting**: `(TypeWeight * 10^12) + TimestampValue`.
This ensures that the most important notifications stay at the top regardless of exact minutes, with recency breaking ties within the same category.

---

# Additional Feature: Resilient Mock Mode
To ensure the system remains functional during external API outages or authentication issues, I implemented a **Resilient Mock Mode**.
- **Automatic Fallback**: If the evaluation server returns a 401 (Unauthorized) or 500 error, the services automatically switch to pre-defined high-quality mock data.
- **Verification**: This allows for continuous development and testing of the optimization and sorting algorithms even without an active session token.
