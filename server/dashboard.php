<?php
include "page_variables.php";
include "page_functions.php";
if(isset($_COOKIE["user_id"]) && isset($_COOKIE["token"]))
{
    header('Content-Type: application/json');
   if(isset($_GET["ACTION_TYPE"]))
   {
    if(VerifyToken($_COOKIE["user_id"],$_COOKIE["token"]))
    {
       switch($_GET["ACTION_TYPE"])
       {
           case "FILES_INF":
             echo json_encode(GetAllFilesData(USER_FOLDER . $_COOKIE["user_id"]));
            break;
           case "RENAME_FILE":
                if(isset($_GET["FILE_PATH"]) && isset($_GET["NEW_NAME"]))
                    {
                        if(file_exists(USER_FOLDER . $_GET["FILE_PATH"]))
                        {
                            if(rename(USER_FOLDER . $_GET["FILE_PATH"],USER_FOLDER . $_GET["NEW_NAME"]))
                            {
                                echo json_encode(["success"=>true]);
                            }
                            else
                            {
                                echo json_encode(["success"=>false,"error"=>"could not rename"]);
                            }
                        }
                        else
                        {
                            echo json_encode(["success"=>false,"error"=>"file didn't found"]);
                        }
                    }
                    else
                    {
                        echo json_encode(["success"=>false,"error"=>"path and name didn't provided"]);
                    }
            break;
           case "DELETE_FILE":
                    if(isset($_GET["FILE_PATH"]))
                    {
                            if(file_exists(USER_FOLDER . $_GET["FILE_PATH"]))
                            {
                                if(unlink(USER_FOLDER . $_GET["FILE_PATH"]))
                                {
                                    echo json_encode(["success"=>true]);
                                }
                                else
                                {
                                    echo json_encode(["success"=>false,"error"=>"could not delete file"]);
                                }
                            }
                            else
                            {
                                echo json_encode(["success"=>false,"error"=>"file didn't found"]);
                            }
                    }
                    else
                    {
                        echo json_encode(["success"=>false,"error"=>"file path didn't provided"]);
                    }
                    break;

           case "CREATE_FOLDER":
            if(isset($_GET["FOLDER_PATH"]))
            {
                if(is_dir(USER_FOLDER . $_GET["FOLDER_PATH"]))
                {
                    echo json_encode(["success"=>false,"error"=>"folder already avialable"]);
                }
                else
                {
                    if(mkdir(USER_FOLDER . $_GET["FOLDER_PATH"]))
                    {
                        echo json_encode(["success"=>true]);
                    }
                    else
                    {
                        echo json_encode(["success"=>false,"error"=>"can't make a folder"]);
                    }
                }
            }
            else
            {
                echo json_encode(["success"=>false,"error"=>"path didn't provided"]);
            }
            break;
           case "RENAME_FOLDER":
            if(isset($_GET["FOLDER_PATH"]) && isset($_GET["NEW_NAME"]))
            {
                if(is_dir(USER_FOLDER .$_GET["FOLDER_PATH"]))
                {
                    if(rename(USER_FOLDER.$_GET["FOLDER_PATH"],USER_FOLDER . $_GET["NEW_NAME"]))
                    {
                        echo json_encode(["success"=>true]);
                    }
                    else
                    {
                        echo json_encode(["success"=>false,"error"=>"couldn't delete "]);
                    }
                }
                else
                {
                    echo json_encode(["success"=>false,"error"=>"Folder didn't found"]);
                }
            }
            else
            {
              echo json_encode(["success"=> false,"error"=>"sufficient data didn't provided"]);
            }
            break;
           case "DELETE_FOLDER":
                if(isset($_GET["FOLDER_PATH"]))
                {
                    if(is_dir(USER_FOLDER . $_GET["FOLDER_PATH"]))
                    {
                        if(rmdir(USER_FOLDER . $_GET["FOLDER_PATH"]))
                        {
                            echo json_encode(["success" => true]);
                        }
                        else
                        {
                            echo json_encode(["success" => false,"error"=>"could not delete folder"]);
                        }
                    }
                    else
                    {
                    echo json_encode(["success" => false , "error" => "Folder didn't found"]);
                    }
                }
                else
                {
                    echo json_encode(["success" => false,"error" => "Folder path didn't provided"]);
                }
                break;
            case "CREATE_PROJECT":
                    $result = ["success"=>false,"error"=>null];
                    $finalCreationPath = null;
                    if(isset($_GET["PROJECT_NAME"]))
                    {
                        if(isset($_GET["SELECTED_FOLDER"]))
                        {
                            if(file_exists( USER_FOLDER . $_GET["SELECTED_FOLDER"]))
                            {
                                if(!file_exists(USER_FOLDER . $_GET["SELECTED_FOLDER"] . '/' . $_GET["PROJECT_NAME"] . ".json" ))
                                {
                                    $finalCreationPath = USER_FOLDER . $_GET["SELECTED_FOLDER"] . '/' . $_GET["PROJECT_NAME"] . ".json";
                                    $result["success"] = true;
                                    $result["error"] = null;
                                }
                            }
                            else
                            {
                                $result["success"] = false;
                                $result["error"] = "No such folder";
                            }
                        }
                        else
                        {
                            if(!file_exists(USER_FOLDER . $_COOKIE["user_id"] . '/' . $_GET["PROJECT_NAME"] . ".json"))
                            {
                                $result["success"] = true;
                                $result["error"] = null;
                                $finalCreationPath = USER_FOLDER . $_COOKIE["user_id"] . '/' . $_GET["PROJECT_NAME"] . ".json";
                            }
                            else
                            {
                                $result["success"] = false;
                                $result["error"] = "project already exists on root folder";
                            }
                        }
                    }
                    else
                    {
                        $result["success"] = false;
                        $result["error"] = "invalid project name";
                    }

                    if($result["success"])
                    {
                        $VideoList = [];
                        $NewImgSection = uniqid();
                        $ImageList = [$NewImgSection => []];
                        if(isset($_GET["FILE_LIST"]))
                        {
                            $fileLSt = json_decode($_GET["FILE_LIST"],true);
                            foreach($fileLSt as $key=>$value)
                            {

                                if($value["type"] == "IMAGE")
                                {
                                    $ImageList[$NewImgSection][uniqid()] = ["path" => USER_FOLDER . $value["path"]];
                                }
                                elseif($value["type"] == "VIDEO")
                                {
                                    $VideoList[uniqid()] = ["path" => USER_FOLDER . $value["path"]];
                                }
                            }
                        }
                        $NewDataJson = [
                                         "PROJECT_NAME" => $_GET["PROJECT_NAME"],
                                         "FILE_LIST_S" => [
                                                            "VIDEO_LIST" => $VideoList,
                                                            "IMAGE_LIST_S" => $ImageList
                                                         ],
                                         "VIDEO_JOINED" => [
                                                             "VIDEO_TIMES" => [],
                                                             "IMAGE_ID_S" => []
                                                           ]
                                       ];
                        file_put_contents($finalCreationPath,json_encode($NewDataJson));
                    }
                    setcookie("active_project",$finalCreationPath,0,"/Greenpen");
                    echo json_encode($result);
                break;
       }
    }
  }
}
?>
