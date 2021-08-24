let cookieData = GetCookie();
if(cookieData.hasOwnProperty("user_name") && cookieData.hasOwnProperty("user_id"))
{
    window.location = "dashboard.html";
}

document.getElementById("SubmitInput").onclick = () =>
{
   let email = document.getElementById("EmailInput").value;
   let password = document.getElementById("PasswordInput").value;
   let username = document.getElementById("UserNameInput").value;

   email = email.trim();
   password = password.trim();
   username = username.trim();
   let CreateAccount = true;
   let Error = null;
   if(email.length < 4)
      {
         CreateAccount = false;
         Error = "Invalid email";  
      }
   else if(password.length < 4)
   {
       CreateAccount = false;
       Error = "password must be grater then 3 character";
   }
   else if(username.length < 4)
   {
       CreateAccount = false;
       Error = "Username must be greater then 3 character"
   }
   if(CreateAccount)
   {
   let DataString = `email=${email}&password=${password}&username=${username}`;
   PerformAjaxRequest("POST",{
        "Content-type" : "application/x-www-form-urlencoded"
    },"../server/signup.php",DataString,true,(data)=>{
        data = JSON.parse(data);
        if(data.success)
        {
            window.location = "dashboard.html";
        }
        else
        {
            alert(data.error);
        }
    });
   }
   else
   {
       alert(Error)
   }
}
document.getElementById("Logo").onclick = ()=>
{
    window.location = "home.html";
}
