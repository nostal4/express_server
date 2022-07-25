async function ApproveToken() {  
  const response = await fetch('/token/user', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('accessToken')
    }
  }); 
  if (response.ok === true) {
    await response.json();
    return localStorage.getItem('accessToken');
  } else {   
    await fetch('/token/newToken', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('refreshToken')
      }
    })
      .then(function (resp1) {  
        return resp1.json();
      })
      .then(function (data) {      
        if (data.accessToken) {         
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
        }     
      });
  }
}
async function check(){
  try{
    await ApproveToken()                    
  }
  catch{
    // window.location.href = "/";                
  }  

}
async function rev_check(){
  try{
    await ApproveToken()   
    window.location.href = "/";                  
  }
  catch{}  

}
