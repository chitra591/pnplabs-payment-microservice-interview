var update = document.getElementById('update')
var selected_account = document.getElementById('selected_account')
var account_id, withdrawal_amount;

selected_account.addEventListener('change', function () {
  document.getElementById('serverResponse').style.display = "none";
  account_id = document.getElementById('selected_account').value;
  fetch('check_balance/'+account_id, {
    method: 'get'
  })
  .then(res => {
    if (res.ok) return res.json()
  })
  .then(data => {
    document.getElementById('balance').innerHTML = data.balance[0].balance
  })
})

update.addEventListener('click', function () {
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
    console.log('response : '+response);
    console.log(response);
    if (response.ok) return response.json()
  })
  .then(data => {
    if(data){
      console.log(data.serverResponse);
      document.getElementById('serverResponse_type').innerHTML = data.serverResponse.type
      document.getElementById('serverResponse_message').innerHTML = data.serverResponse.message
      document.getElementById('serverResponse').style.display = "block";
    }else {
      window.location.reload()
    }
  })
})
