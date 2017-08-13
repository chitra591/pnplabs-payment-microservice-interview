var update = document.getElementById('update')
var selected_account = document.getElementById('selected_account')
var account_id, withdrawal_amount;

selected_account.addEventListener('change', function () {
  console.log("main.js : selected_account eventlistner");
  account_id = document.getElementById('selected_account').value;
  fetch('check_balance/'+account_id, {
    method: 'get'
  })
  .then(res => {
    if (res.ok) return res.json()
  })
  .then(data => {
    console.log(data.balance[0].balance)

    document.getElementById('balance').innerHTML = data.balance[0].balance
  })
})

update.addEventListener('click', function () {
  console.log("main.js : update eventlistner");
  account_id = document.getElementById('selected_account').value;
  withdrawal_amount = document.getElementById('withdrawal_amount').value;
  fetch('withdraw', {
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'account_id': account_id,
      'withdrawal_amount': withdrawal_amount
    })
  })
  .then(response => {
    if (response.ok) return response.json()
  })
  .then(data => {
    console.log(data)
    window.location.reload(true)
  })
})
