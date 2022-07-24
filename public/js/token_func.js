async function ApproveToken() {
  console.log(11);
  const response = await fetch('/token/user', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('accessToken')
    }
  });
  console.log(22);
  if (response.ok === true) {
    console.log('a');
    await response.json();
    return localStorage.getItem('accessToken');
  } else {
    console.log('b');
    await fetch('/token/newToken', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('refreshToken')
      }
    })
      .then(function (resp1) {
        console.log('c');
        return resp1.json();
      })
      .then(function (data) {
        console.log('d');
        console.log(data);
        if (data.accessToken) {
          console.log('grehgrh');
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        // else{
        //     localStorage.removeItem("accessToken")
        //     localStorage.removeItem("refreshToken")
        //     // window.location.href = '/';
        //     return "111Error"
        // }
      });
  }
}
