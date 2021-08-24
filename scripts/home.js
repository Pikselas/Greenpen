let cookieData = GetCookie();
if(cookieData.hasOwnProperty("user_name") && cookieData.hasOwnProperty("user_id"))
{
    window.location = "dashboard.html";
}
function GotoLoginPage()
{
    window.location = "login.html";
}
function GotoSignUpPage()
{
    window.location = "signup.html";
}