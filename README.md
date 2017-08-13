# pnplabs-payment-microservice-interview

## Installation
1. Clone repo
2. Run npm install

## Usage
1. Run npm run dev

2. http://localhost:3000 (GET)
   - Will list all the users
   
3. http://localhost:3000/user/3 (GET)
   - Will list the details of the particular user
   
4. http://localhost:3000/check_balance/2 (GET)
   - Will give account balace of the user, with user.id = 2
   
5. http://localhost:3000/withdraw (PUT), with body {"id": "2", "withdrawal_amount": "6000"}
   - Will try to deduct the balance amount of user, with id = 2
   - Amount will be deducted if withdrawal amount is less than balance. Else and error message, and the current balance is returned.
   
