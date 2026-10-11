# Gym Equipment Rental System — REST API

A Spring Boot REST API for managing gym equipment rentals: equipment inventory,
gym members, and rental transactions between them, with business rules enforced
in the service layer.

## Entities (3, as required)

1. **Equipment** — a rentable item (name, category, daily rate, purchase date, status)
2. **Member** — a gym member (name, phone, membership type, join date, active flag)
3. **Rental** — links an Equipment to a Member for a period, with cost and late fee

## Business rules applied

- Equipment can only be rented while its status is `AVAILABLE`; renting it sets
  status to `RENTED`, and returning it sets status back to `AVAILABLE`.
- Only an `active` member can create a rental.
- `dueDate` must be a future date.
- Total rental cost = number of days × equipment's daily rate, computed automatically.
- Returning a rental after its due date applies a late fee (1.5× daily rate per late day).
- Equipment currently `RENTED` cannot be deleted.
- A member with an active or overdue rental cannot be deleted.
- A rental that's still active cannot be deleted (must be returned first).
- `GET /api/rentals/overdue` finds and flags rentals past their due date that
  haven't been returned.

## Setup

1. Create the database: `CREATE DATABASE gym_equipment_rental_api_db;`
2. Adjust credentials in `src/main/resources/application.properties` if your local
   PostgreSQL username/password isn't `postgres`/`postgres`.
3. Start RabbitMQ on `localhost:5672` with username/password `guest`/`guest`.
   If Docker is installed, run:
   `docker compose -f docker-compose.rabbitmq.yml up -d`
   The RabbitMQ management UI will be available at **http://localhost:15672**.
4. Run: `mvn spring-boot:run` (or run `GymEquipmentRentalApiApplication` from IntelliJ)
5. The API starts on **http://localhost:8081**

## RabbitMQ notifications

Membership application and membership update events are published to RabbitMQ.
The API declares:

- Exchange: `gym.notifications.exchange`
- Email queue: `gym.notifications.email`
- SMS queue: `gym.notifications.sms`
- Email routing key: `notification.email`
- SMS routing key: `notification.sms`

The included consumers currently simulate delivery by logging `Email sent...` and
`SMS sent...`. Replace `NotificationConsumer` with real email/SMS provider calls
when provider credentials are available.

## Endpoints used by the frontend

All routes are under `/api`. Ids are returned as strings. Errors look like
`{"message": "..."}` (validation errors also include `fieldErrors`).

| Method | Endpoint                          | Description                                              |
|--------|-----------------------------------|----------------------------------------------------------|
| POST   | /api/auth/login                   | Staff or member login (`identifier`, `password`)         |
| POST   | /api/applications                 | Public membership application (starts as PENDING)        |
| GET    | /api/members                      | List members                                             |
| PUT    | /api/members/{id}                 | Update name, phone, plan                                 |
| PUT    | /api/members/{id}/approve         | Approve application (ACTIVE, sets join date and expiry)  |
| PUT    | /api/members/{id}/reject          | Reject application                                       |
| PUT    | /api/members/{id}/status          | Activate or deactivate (`{"active": true}`)              |
| PUT    | /api/members/{id}/plan            | Change plan without paying                               |
| POST   | /api/members/{id}/renewals        | Renew membership (creates a payment)                     |
| DELETE | /api/members/{id}                 | Delete (blocked with an open rental)                     |
| GET    | /api/equipment                    | List equipment                                           |
| POST   | /api/equipment                    | Add equipment                                            |
| PUT    | /api/equipment/{id}               | Update equipment                                         |
| DELETE | /api/equipment/{id}               | Delete (blocked while RENTED)                            |
| GET    | /api/rentals                      | List rentals                                             |
| POST   | /api/rentals                      | Rent equipment (`equipmentId`, `clientId`, `dueDate`)    |
| PUT    | /api/rentals/{id}/return          | Return equipment (computes late fee)                     |
| GET    | /api/rentals/overdue              | Flag overdue rentals                                     |
| DELETE | /api/rentals/{id}                 | Delete a returned rental                                 |
| GET    | /api/payments                     | Payment history (staff)                                  |
| GET    | /api/auth/me                      | Current user for a stored token                          |
| GET    | /api/me                           | Own member profile (member only)                         |
| GET    | /api/me/rentals                   | Own rentals (member only)                                |
| GET    | /api/me/payments                  | Own payments (member only)                               |

### Authorization
Login returns a JWT (`token`). Send it on every request as `Authorization: Bearer <token>`.
Tokens last 8 hours (`app.jwt.expiration-minutes`) and are signed with `JWT_SECRET`
(set it as an environment variable in IntelliJ's run configuration; at least 32 characters).

| Who | Can do |
|-----|--------|
| Anyone | Log in (`/api/auth/login`), apply for membership (`/api/applications`) |
| Member | Browse equipment; view and manage **their own** profile (`/api/me`), rentals and payments; rent and return their own equipment; renew or change their own plan |
| Staff | Everything: manage equipment, all members (approve, reject, activate, edit, delete), all rentals, all payments, overdue report |

A member asking for someone else's record gets `403`. A missing or expired token gets `401`.

### Demo logins (seeded on first run)
- Staff: `staff` / `staff123`
- Member: `client` / `client123`

### Running with the frontend
1. Start this backend on port 8081 (IntelliJ: run `GymEquipmentRentalApiApplication`).
2. In the frontend folder, run `npm install` then `npm run dev` (serves on http://localhost:5173).
3. The backend allows requests from that origin by default. To change it, set `app.cors.allowed-origins` in `application.properties`.

## GitHub

Public repository: _add your repo link here once pushed_
