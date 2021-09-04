
var User = null;
var FileHandaler = null;
var FolderHandaler = null;

var SelectedFolder = null;
var SelectedFiles = [];

function OptionSelectHandaler(OptionValue)
{
    FileHandaler = null;
    FolderHandaler = null;
    switch(OptionValue)
    {
        case "NOTHING":
            SelectedFiles = [];
            SelectedFolder = null;
            break;
        case "SELECT-FILE":
            FileHandaler = SelectFile;
            break;
        case "RENAME-FILE":
            FileHandaler= RenameFile;
            break;
        case "DELETE-FILE":
            FileHandaler = DeleteFile;
            break;
        case "SELECT-FOLDER":
            FolderHandaler = SelectFolder;
            break;
        case "RENAME-FOLDER":
            FolderHandaler = RenameFolder;
            break;
        case "DELETE-FOLDER":
            FolderHandaler = DeleteFolder;
            break;

    }
}
function SelectFile(FileDiv)
{
    let prnt = document.getElementById("SelectedLst").children[1];
    let IdPart =FileDiv.id.split('_');
    if(document.getElementById(IdPart[0]+ "_selected") == null)
    {
        let NewFile = CreateFileNode(FileDiv.innerHTML,{
            selectedpath : FileDiv.attributes.sourcepath.textContent,
            sourcepath : null
        });
        NewFile.id = IdPart[0] + "_selected";
        //NewFile.attributes.onclick.textContent = "";
        prnt.children[1].append(NewFile);
    }
    //SelectedFiles.push(FileDiv);
}
//use it as a file handaler for renaming file
function RenameFile(FileDiv)
{
    let File = FileDiv.attributes.sourcepath.textContent;
    let FilePath = File.split('/');
    let FileName = FilePath.pop();
    FilePath = FilePath.join('/');
    let WillRename = prompt("New Name",FileName);
    if(WillRename != null)
    {
        FilePath = FilePath + '/' + WillRename;
        let ReqBody = "ACTION_TYPE=RENAME_FILE&FILE_PATH="+File+"&NEW_NAME="+FilePath;
        PerformAjaxRequest("GET",{},"../server/dashboard.php?"+ReqBody,"",true,(data)=>{
            data = JSON.parse(data);
            if(data.success)
            {
                FileDiv.attributes.sourcepath.textContent = FilePath;
                FileDiv.innerHTML = FilePath.split('/').reverse()[0];
            }
            else
            {
                console.log(data.error);
            }
        });
    }
}
//use it as a  file handaler for deleting files
function DeleteFile(FileDiv)
{
    if(FileDiv.attributes.sourcepath.textContent != "null")
    {
    let ReqBody = "ACTION_TYPE=DELETE_FILE&FILE_PATH="+FileDiv.attributes.sourcepath.textContent;
    PerformAjaxRequest("GET",{},"../server/dashboard.php?"+ReqBody,"",true,(data)=>{
        data = JSON.parse(data);
        if(data.success)
        {
            FileDiv.parentElement.removeChild(FileDiv);
        }
        else
        {
            console.log(data.error);
        }
    });
   }
   else
   {
       FileDiv.parentElement.removeChild(FileDiv);
   }
}
//use it as a folder handaler for selecting folder
function SelectFolder(FolderTitleDiv)
{
    let SelectedSec = document.getElementById("SelectedLst").children[0].children[1];
    SelectedFolder = FolderTitleDiv.parentElement;
    if(SelectedFolder.attributes.path.textContent != null)
    {
        SelectedSec.innerHTML = "";
        let NewFolderNode = CreateFolderNode(FolderTitleDiv.innerHTML);
        NewFolderNode.setAttribute("selectedpath",SelectedFolder.attributes.path.textContent);
        NewFolderNode.setAttribute("path",null);
        SelectedSec.appendChild(NewFolderNode);
    }

}
function RenameFolder(FolderTitleDiv)
{
    let Folder = FolderTitleDiv.parentElement;
    let FolderPath = Folder.attributes.path.textContent;
    if(FolderPath != "null")
    {
        let NameParts = FolderPath.split('/');
        let Name = NameParts.pop();
        let NewName = prompt("Enter new Name",Name);
        Name = NewName;
        if(NewName != null)
        {
        NameParts.push(NewName);
        NewName = NameParts.join('/');
        let ReqBody = "ACTION_TYPE=RENAME_FOLDER&FOLDER_PATH="+FolderPath+"&NEW_NAME="+NewName;
        PerformAjaxRequest("GET",{},"../server/dashboard.php?"+ReqBody,"",true,(data)=>{
            data = JSON.parse(data);
            if(data.success)
            {
                FolderTitleDiv.innerHTML = Name;
                Folder.attributes.path.textContent = NewName;
            }
        });
    }
    }
}
//use it as folder handaler for deleting empty folders
function DeleteFolder(FolderTitleDiv)
{
    if(FolderTitleDiv.parentElement.attributes.path.textContent != "null")
    {
    let ReqBody = "ACTION_TYPE=DELETE_FOLDER&FOLDER_PATH="+FolderTitleDiv.parentElement.attributes.path.textContent;
    PerformAjaxRequest("GET",{},"../server/dashboard.php?"+ReqBody,"",true,(data)=>{
        data = JSON.parse(data);
       if(data.success)
       {
           FolderTitleDiv.parentElement.parentElement.removeChild(FolderTitleDiv.parentElement);
       }
    });
    }
    else
    {
        FolderTitleDiv.parentElement.parentElement.removeChild(FolderTitleDiv.parentElement);
        SelectedFolder = null;
    }
}
//triggers when clicked on a file name from file panel
function OnClickFile(ev)
{
    if(FileHandaler != null)
    {
        FileHandaler(ev.target);
    }
}
function OnDblClickFile(ev)
{
   let Type = ev.target.attributes.filetype.textContent;
   let Path = ev.target.attributes.sourcepath.textContent;
   switch(Type)
   {
       case "JSON":
           document.cookie = `active_project=${USER_FOLDER + Path};path=/Greenpen`;
           window.open("editor.html");
       default:
        window.open(USER_FOLDER + Path);
         break;
   }
}
function OnClickFolder(ev)
{
    if(FolderHandaler != null)
    {
        FolderHandaler(ev.target);
    }
}

function CreateFileNode(name,attributes = {})
{
    let FileNode = document.createElement("div");
    let ext = name.split('.');
             if(ext.length > 1)
             {
                ext = ext.reverse()[0]; 
                ext = ext.toLowerCase();
                if(ext == "mp4")
                {
                    ext = "VIDEO";
                }
                else if(ext == "png" || ext == "jpg" || ext == "jpeg" || ext == "gif" || ext == "bmp")
                {
                    ext = "IMAGE";
                }
                else if(ext == "json")
                {
                    ext = "JSON";
                }
             }
             else
             {
                ext = "UNKNOWN";
             }
    FileNode.id = (Math.random() + 1).toString(36).substring(7);
    FileNode.innerHTML = name;
    Object.keys(attributes).forEach((value)=>{
        FileNode.setAttribute(value,attributes[value]);
    });
    FileNode.setAttribute("onclick","OnClickFile(event)");
    FileNode.setAttribute("ondblclick"," OnDblClickFile(event)");
    FileNode.setAttribute("filetype",ext);
    FileNode.className = "FolderFile";
    return FileNode;
}

function CreateFolderNode(name)
{
    let FolderNodeDiv = document.createElement("div");
    let FolderTitleDiv = document.createElement("div");
    let FolderContentsDiv = document.createElement("div");
    
    FolderNodeDiv.className = "FolderArea";
    FolderNodeDiv.setAttribute("name",name);
    FolderTitleDiv.className = "FolderTitle";
    FolderTitleDiv.setAttribute("onclick","OnClickFolder(event)");
    FolderContentsDiv.className = "FolderContents";

    FolderTitleDiv.innerHTML = name;
    FolderNodeDiv.appendChild(FolderTitleDiv);
    FolderNodeDiv.appendChild(FolderContentsDiv);

    return FolderNodeDiv;
}


//stting user's file tree 
function SetUserRsources(ArrayVal,FileSec,Folder)
{
     for(let i = 0;i < ArrayVal.length;i++)
     {
         if(!Array.isArray(ArrayVal[i]))
         {
             let NewFile = CreateFileNode(ArrayVal[i],{
                "sourcepath": Folder + '/' + ArrayVal[i]});
                NewFile.id += "_original";
            FileSec.appendChild(NewFile);
         }
         else
         {
             let NewFolder = CreateFolderNode(ArrayVal[i][0]);
             let NewPath = Folder + '/' + NewFolder.attributes.name.textContent;
             NewFolder.setAttribute("path",NewPath);
             FileSec.appendChild(NewFolder);
             ArrayVal[i].splice(0,1);
             SetUserRsources(ArrayVal[i],NewFolder.children[1],NewPath);
         }
     }
}

function CreateFolder()
{
   let NewFolderPath = null 
   let Inserter = null;
   if(SelectedFolder == null)
   {
      NewFolderPath = GetCookie()["user_id"];
      Inserter = document.getElementById("Lst");
   }
   else
   {
       NewFolderPath = SelectedFolder.attributes.path.textContent;
       Inserter = SelectedFolder.children[1];
   }
   let FolderName = prompt("Enter Folder Name",NewFolderPath + "/New Folder");
   if(FolderName != null)
   {
    let ReqBody = "ACTION_TYPE=CREATE_FOLDER&FOLDER_PATH="+FolderName;
    PerformAjaxRequest("GET",{},"../server/dashboard.php?"+ReqBody,"",true,(data)=>{
        data = JSON.parse(data);
        if(data.success)
        {
            let Fldr = CreateFolderNode(FolderName.split('/').reverse()[0]);
            Fldr.setAttribute("path",FolderName);
            Inserter.appendChild(Fldr);
        }
        else
        {
            alert(data.error);
        }
    });
   }
}

function CreateProject()
{

    //[name:{path:"",type:""}]
    let ProjectName = prompt("Project Name");
    if(ProjectName != null)
    {
    let SelectedFileList = document.getElementById("SelectedLst").children[1].children[1].children;
    let selected = {};

    for(let i = 0;i<SelectedFileList.length ;i++)
    {   
      selected[SelectedFileList[i].innerHTML] = {path: SelectedFileList[i].attributes.selectedpath.textContent,
                                       type: SelectedFileList[i].attributes.filetype.textContent}
    }
    let SelectFolder = document.getElementById("SelectedLst").children[0].children[1].children;
    if(SelectFolder.length > 0)
    {
        SelectFolder = SelectFolder[0].attributes.selectedpath.textContent;
    }
    else
    {
        SelectFolder = GetCookie()["user_id"];
    }
    let UrlString = `../server/dashboard.php?ACTION_TYPE=CREATE_PROJECT&SELECTED_FOLDER=${SelectFolder}&PROJECT_NAME=${ProjectName}&FILE_LIST=` + JSON.stringify(selected)
    PerformAjaxRequest("GET",{},UrlString,"",true,(data)=>{
        console.log(data);
        data = JSON.parse(data);
        if(data.success)
        {
            window.location = "editor.html";
        }
        else
        {
            alert(data.error);
        }
    });
    }   
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
            User = GetCookie();
            document.getElementById("Logo").children[0].innerHTML = User["user_name"];
            PerformAjaxRequest("GET",{},"../server/dashboard.php?ACTION_TYPE=FILES_INF","",true,(data)=>{
                    data = JSON.parse(data);
                    let Folder = data[0];
                    data.splice(0,1);
                    SetUserRsources(data,document.getElementById("Lst"),Folder);
                });
        }
    });
}
document.getElementById("Toggle").onclick = (ev)=>
{
    let FileListsec = document.getElementById("FileSection");
    let widthShow = Number(FileListsec.attributes.SizeShow.textContent);
    let widthHide = Number(FileListsec.attributes.SizeHide.textContent);
    if(Number(FileListsec.style.width.split("p")[0]) < widthShow)
    {
        FileListsec.style.width = String(widthShow) + "px";
        ev.target.innerHTML = '<';
        document.getElementById("Lst").style.opacity = "1";
        document.getElementById("SelectedLst").style.opacity = "1";
    }
    else
    {
        FileListsec.style.width = widthHide + "px";
        ev.target.innerHTML = '>';
        document.getElementById("Lst").style.opacity = "0";
        document.getElementById("SelectedLst").style.opacity = "0";
    }
}
document.getElementById("Incrs").onclick = ()=>
{
    let FileListsec = document.getElementById("FileSection");
    let width = Number(FileListsec.style.width.split("p")[0]);
    let HideWidth = Number(FileListsec.attributes.SizeHide.textContent);
    let MaxableWidth = Number(FileListsec.attributes.SizeMax.textContent);
    if(width > HideWidth)
    {
        let NextSize = Number(FileListsec.attributes.SizeShow.textContent) + 30;
        if(NextSize <= MaxableWidth)
        {
            FileListsec.attributes.SizeShow.textContent = NextSize;
            FileListsec.style.width = FileListsec.attributes.SizeShow.textContent + "px";
        }
    }
}
document.getElementById("Dcrs").onclick = ()=>{
    let FileListsec = document.getElementById("FileSection");
    let width = Number(FileListsec.style.width.split("p")[0]);
    let HideWidth = Number(FileListsec.attributes.SizeHide.textContent);
    let MinimumWidth = Number(FileListsec.attributes.SizeMin.textContent);
    if(width > HideWidth)
    {
        let NextSize = Number(FileListsec.attributes.SizeShow.textContent) - 30;
        if(NextSize >= MinimumWidth)
        {
            FileListsec.attributes.SizeShow.textContent = NextSize;
            FileListsec.style.width = FileListsec.attributes.SizeShow.textContent + "px";
        }
    }
}
document.getElementById("FileList").onchange = (ev)=>
{
    let TargetPath = null;
    let  SlFolder = SelectedFolder;
    let FileNames = [];
    if(SlFolder == null)
    {
        SlFolder = document.getElementById("Lst");
        TargetPath = GetCookie()["user_id"];
    }
    else
    {
        TargetPath = SlFolder.attributes.path.textContent;
        SlFolder = SlFolder.children[1];
    }
    let FrmDt = new FormData();
    let FileLength = ev.target.files.length;
    for(let i = 0;i < FileLength;i++)
    {
        FrmDt.append("FileList[]",ev.target.files[i]);
        FileNames.push(ev.target.files[i].name);
    }
    FrmDt.append("target",TargetPath);
    PerformAjaxRequest("POST",{},"../server/uploadfile.php",FrmDt,true,(data)=>{
        console.log(data);
        data = JSON.parse(data);
        for(let i = 0; i < FileNames.length;i++)
        {
            if(data[i])
            {
                SlFolder.appendChild(CreateFileNode(FileNames[i],{
                    sourcepath:TargetPath + "/" + FileNames[i]
                }));
            }
        }
    });
}