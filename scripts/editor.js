document.body.onload = ()=>
{
    //verifying user
    PerformAjaxRequest("GET",{},"../server/verify_user.php","",true,(data)=>{
        let verifed = JSON.parse(data);
        if(!verifed.success)
        {
            alert(verifed.error);
            window.location = "home.html";
        }
        else
        {
            let biscuit = GetCookie();
            if(!biscuit.hasOwnProperty("active_project"))
            {
                window.location = "dashboard.html";
            }
            else
            {
               PerformAjaxRequest("GET",{},biscuit["active_project"],"",true,(data)=>{
                    let ProjectObj = JSON.parse(data);
                    let NewImgDivSec = document.createElement("div");
                    NewImgDivSec.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
                    NewImgDivSec.className = "MainSecChild_IMGDIV";
                    NewImgDivSec.draggable = true;
                    NewImgDivSec.setAttribute("ondragstart","OnDragStart(event)");
                    document.getElementById("MainSection").appendChild(NewImgDivSec);

               });
            }
        }
    });
}
function OnDragStart(ev)
{
    ev.dataTransfer.setData("Item",ev.target.id);
}
function onDrop(ev)
{
    let Obj = document.getElementById(ev.dataTransfer.getData("Item"));
    //ev.target.removeChild(Obj);
    Obj.style.top = ev.layerY + "px";
    Obj.style.left = ev.layerX + "px";
    //ev.target.appendChild(Obj);
    console.log(ev);
}
function onDragOver(ev)
{
    ev.preventDefault();
}