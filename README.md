# Expense Splitter

A full-stack expense-sharing application inspired by Splitwise that helps groups track shared expenses, calculate balances, and settle debts efficiently.

## Features

### Authentication

* User Registration
* User Login
* JWT Authentication
* Refresh Token Rotation
* Logout
* Logout from All Devices
* Session Management

### Group Management

* Create Group
* View Groups
* Add Members
* Remove Members
* Leave Group
* Delete Group

### Expense Management

* Create Expense
* View Expenses
* Update Expense
* Delete Expense
* Equal Split
* Exact Split

### Balance Engine

* Calculate Net Balances
* Debt Simplification
* Determine Who Owes Whom

### Settlements

* Create Settlement
* View Settlements
* Update Settlement
* Delete Settlement

### Dashboard

* Group Summary
* Total Expenses
* Total Settlements
* Member Statistics

---

## Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs

### Frontend (In Progress)

* React
* Vite
* Tailwind CSS
* shadcn/ui
* Axios
* React Router

---

## Project Structure

```text
expense-splitter/

├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   ├── config/
│   └── server.js
│
├── frontend/
│   └── src/
│
└── README.md
```

---

## API Modules

### Auth

* Register
* Login
* Refresh Token
* Logout
* Logout All Devices
* Get Current User

### Groups

* Create Group
* Get Groups
* Get Group By Id
* Add Member
* Remove Member
* Leave Group
* Delete Group

### Expenses

* Create Expense
* Get Expenses
* Get Expense By Id
* Update Expense
* Delete Expense

### Balances

* Get Group Balances

### Settlements

* Create Settlement
* Get Settlements
* Update Settlement
* Delete Settlement

---

## Future Enhancements

* UPI Integration
* Expense Notifications
* Group Invitations
* Recurring Expenses
* Real-time Updates
* AWS Deployment

---

## Author

Harsh Rathore
