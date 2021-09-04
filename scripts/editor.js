 
 var ProjectJsonData = null;

 function OnImgFrmDel(ev)
 {
    let ImageLists = ProjectJsonData["FILE_LIST_S"]["IMAGE_LIST_S"][ev.target.parentElement.id];
    delete ProjectJsonData["FILE_LIST_S"]["IMAGE_LIST_S"][ev.target.parentElement.id];
    console.log(ImageLists);
    ev.target.parentElement.style.opacity = 0;
    setTimeout(()=>{document.getElementById("MainSection").removeChild(ev.target.parentElement)},500);
 }

 function OnVidFrameDel(ev)
 {
    let VideoItem = ProjectJsonData["FILE_LIST_S"]["VIDEO_LIST"][ev.target.parentElement.id];
    delete ProjectJsonData["FILE_LIST_S"]["VIDEO_LIST"][ev.target.parentElement.id];
    ev.target.parentElement.style.opacity = 0;
    setTimeout(()=>{document.getElementById("MainSection").removeChild(ev.target.parentElement)},500);
 }
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

    let ButtonDelete = document.createElement("button");
    ButtonDelete.innerHTML = "X";
    ButtonDelete.className = "deleteButton";
    ButtonDelete.setAttribute("onclick","OnImgFrmDel(event)");

    let ButtonAdd = document.createElement("button");
    ButtonAdd.innerHTML = "+";
    ButtonAdd.className = "addButton";


    let NewImgDivContainer = document.createElement("div");
    NewImgDivContainer.className = "ImageContainer";

    NewImgDivSec.appendChild(ButtonDelete);
    NewImgDivSec.appendChild(ButtonAdd);
    NewImgDivSec.appendChild(NewImgDivContainer);

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

    let ButtonDelete = document.createElement("button");
    ButtonDelete.innerHTML = "X";
    ButtonDelete.className = "deleteButton";
    ButtonDelete.setAttribute("onclick","OnVidFrameDel(event)");

    NewVidDiv.appendChild(ButtonDelete);

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
                            ImageSection.children[2].appendChild(NewImg);
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
     let ImgObj = document.getElementById(ev.dataTransfer.getData("ImageItem"));
     ProjectJsonData["FILE_LIST_S"]["IMAGE_LIST_S"][Target.parentElement.id][ImgObj.id] = ProjectJsonData["FILE_LIST_S"]["IMAGE_LIST_S"][ImgObj.parentElement.parentElement.id][ImgObj.id];
     delete ProjectJsonData["FILE_LIST_S"]["IMAGE_LIST_S"][ImgObj.parentElement.parentElement.id][ImgObj.id];
     Target.appendChild(ImgObj);
    }
}
window.ondrop = (ev)=>{
    ev.preventDefault();
};
//adding new image frame
document.getElementById("newImgFrameButton").onclick = ()=>{
    let NewImgFrameID = (Math.random() + 1).toString(36).substring(2);
    ProjectJsonData["FILE_LIST_S"]["IMAGE_LIST_S"][NewImgFrameID] = {};
    let ImageFrame = CreateImgDiv(NewImgFrameID);
    document.getElementById("MainSection").appendChild(ImageFrame);
};
//saving project
document.getElementById("saveProject").onclick = ()=>{
    PerformAjaxRequest("GET",{},`../server/editor.php?ACTION_TYPE=${"SAVE_PROJECT"}&PROJECT_JSON=${JSON.stringify(ProjectJsonData)}`,"",true,(data)=>{
        console.log(data);
    });
};
