 
 var ProjectJsonData = null;
function CreateImgDiv(ID)
{
    let NewImgDivSec = document.createElement("div");
    NewImgDivSec.id = ID;
    NewImgDivSec.style.top = String(Math.floor((Math.random() * 40) + 1)) + "%";
    NewImgDivSec.style.left = String(Math.floor((Math.random() * 60) + 1)) + "%";
    NewImgDivSec.className = "MainSecChild_IMGDIV";
    NewImgDivSec.draggable = true;
    NewImgDivSec.setAttribute("ondragstart","OnDragStart(event)");
    NewImgDivSec.setAttribute("ondrop","onImageDrop(event)");
    NewImgDivSec.setAttribute("ondragover","onImageDragOver(event)");

    let NewImgDivContainer = document.createElement("div");
    NewImgDivContainer.className = "ImageContainer";
    
    NewImgDivSec.appendChild(NewImgDivContainer)

    return NewImgDivSec;
}

function CreateVideoObj(ID,path)
{
    let NewVidDiv = document.createElement("div");
    NewVidDiv.id = ID;
    NewVidDiv.style.top = String(Math.floor((Math.random() * 40) + 1)) + "%";
    NewVidDiv.style.left = String(Math.floor((Math.random() * 60) + 1)) + "%";
    NewVidDiv.className = "MainSecChild_VIDDIV";
    NewVidDiv.draggable = true;
    NewVidDiv.setAttribute("ondragstart","OnDragStart(event)");

    let NewVid = document.createElement("video");
    NewVid.src = path;
    NewVid.controls = true;
    NewVidDiv.appendChild(NewVid);
    return NewVidDiv;
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
                    ProjectJsonData = ProjectObj;
                    let MainSection = document.getElementById("MainSection");
                    Object.keys(ProjectObj["FILE_LIST_S"]["VIDEO_LIST"]).forEach(async (VideoID)=>{
                        let VidSec = CreateVideoObj(VideoID,USER_FOLDER + ProjectObj["FILE_LIST_S"]["VIDEO_LIST"][VideoID]["path"]);
                        MainSection.appendChild(VidSec);
                    });
                    
                    Object.keys(ProjectObj["FILE_LIST_S"]["IMAGE_LIST_S"]).forEach(async (ImageSectionID)=>{
                        let ImageSection = CreateImgDiv(ImageSectionID);
                        MainSection.appendChild(ImageSection);
                        Object.keys(ProjectObj["FILE_LIST_S"]["IMAGE_LIST_S"][ImageSectionID]).forEach((ImageID)=>{
                            let NewImg = document.createElement("img");
                            NewImg.id = ImageID;
                            NewImg.className = "ImgObj";
                            NewImg.draggable = true;
                            NewImg.setAttribute("ondragstart","onImageDragStart(event)");
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
    if(Obj.tagName == "DIV")
    {
        document.getElementById("MainSection").removeChild(Obj);
        document.getElementById("MainSection").appendChild(Obj);
        setTimeout(()=>{
            Obj.style.top = ev.clientY - Number(ev.dataTransfer.getData("Ypos")) + "px";
            Obj.style.left = ev.clientX - Number(ev.dataTransfer.getData("Xpos")) + "px";
        },1);
    }
}
function onDragOver(ev)
{
    ev.preventDefault();
}
function onImageDragStart(ev)
{
    ev.dataTransfer.setData("ImageItem",ev.target.id);
}
function onImageDragOver(ev)
{
    ev.preventDefault();
}
function onImageDrop(ev)
{
    console.log(ev);
    let Target = null;
    switch(ev.target.className)
    {
        case "ImageContainer":
            Target =  ev.target;
            break;
        case "ImgObj":
            Target = ev.target.parentElement;
            break;
        case "MainSecChild_IMGDIV":
            Target = ev.target.children[0];
    }
    if(Target)
    {
     Target.appendChild(document.getElementById(ev.dataTransfer.getData("ImageItem")));
    }
}
window.ondrop = (ev)=>{
    ev.preventDefault();
};

document.getElementById("newImgFrameButton").onclick = ()=>{
    let NewImgFrameID = (Math.random() + 1).toString(36).substring(2);
    ProjectJsonData["FILE_LIST_S"]["IMAGE_LIST_S"][NewImgFrameID] = {};
    document.getElementById("MainSection").appendChild(CreateImgDiv(NewImgFrameID));
};
document.getElementById("saveProject").onclick = ()=>{

};
