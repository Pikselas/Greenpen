function PerformAjaxRequest(
    type , 
    headers,
    Url,
     RequestBody,
     asyncronous = true,callingFunction = null)
{

let AjxReq = new XMLHttpRequest();
AjxReq.onreadystatechange = ()=>{
if(AjxReq.readyState == 4 && AjxReq.status == 200)
{
    if(callingFunction != null)
    {
        callingFunction(AjxReq.response);
    }
}
}
AjxReq.open(type,Url,asyncronous);
Object.keys(headers).forEach((key)=>{
    AjxReq.setRequestHeader(key,headers[key]);
    })
AjxReq.send(RequestBody);
}

function GetCookie()
{
    let str = document.cookie;
    let Json = {};
    if(str.length > 0)
    {
    str = str.split(';');
    str.forEach((data)=>{
        data = data.split('=');
        Json[data[0].trim()] =  decodeURIComponent(data[1].trim());
    });
    }
    return Json;
}