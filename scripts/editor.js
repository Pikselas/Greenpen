function CreateImgDiv(ID)
{
    let NewImgDivSec = document.createElement("div");
    NewImgDivSec.id = ID;
    NewImgDivSec.style.top = String(Math.floor((Math.random() * 40) + 1)) + "%";
    NewImgDivSec.style.left = String(Math.floor((Math.random() * 60) + 1)) + "%";
    NewImgDivSec.className = "MainSecChild_IMGDIV";
    NewImgDivSec.draggable = true;
    NewImgDivSec.setAttribute("ondragstart","OnDragStart(event)");

    let NewImgDivContainer = document.createElement("div");
    
    NewImgDivSec.appendChild(NewImgDivContainer)

    return NewImgDivSec;
}

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
                    Object.keys(ProjectObj["FILE_LIST_S"]["IMAGE_LIST_S"]).forEach(async (ImageSectionID)=>{
                        let ImageSection = CreateImgDiv(ImageSectionID);
                        document.getElementById("MainSection").appendChild(ImageSection);
                        Object.keys(ProjectObj["FILE_LIST_S"]["IMAGE_LIST_S"][ImageSectionID]).forEach((ImageID)=>{
                            let NewImg = document.createElement("img");
                            NewImg.id = ImageID;
                            NewImg.src = USER_FOLDER + ProjectObj["FILE_LIST_S"]["IMAGE_LIST_S"][ImageSectionID][ImageID]["path"];
                            ImageSection.children[0].appendChild(NewImg);
                        });
                    });

               });
            }
        }
    });
}
function OnDragStart(ev)
{
    ev.dataTransfer.setData("Item",ev.target.id);
    ev.dataTransfer.setData("Xpos",ev.layerX);
    ev.dataTransfer.setData("Ypos",ev.layerY);
}
function onDrop(ev)
{
    let Obj = document.getElementById(ev.dataTransfer.getData("Item"));
    Obj.style.top = ev.layerY - Number(ev.dataTransfer.getData("Ypos")) + "px";
    Obj.style.left = ev.layerX - Number(ev.dataTransfer.getData("Xpos")) + "px";
}
function onDragOver(ev)
{
    ev.preventDefault();
}
