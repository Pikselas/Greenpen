<?php
include "page_variables.php";
include "page_functions.php";
if(isset($_COOKIE["user_id"]) && isset($_COOKIE["token"]))
{
    header('Content-Type: application/json');
   if(isset($_POST["target"]) && isset($_FILES["FileList"]))
   {
    if(VerifyToken($_COOKIE["user_id"],$_COOKIE["token"]))
    {
      $SuccessList = array();
      $TotalFiles = count($_FILES["FileList"]["name"]);
      for($i = 0;$i < $TotalFiles ;$i++)
      {
          $NewName = USER_FOLDER .$_POST["target"] . '/' . $_FILES["FileList"]["name"][$i];
          if(!file_exists($NewName))
          {
            if(move_uploaded_file($_FILES["FileList"]["tmp_name"][$i],$NewName))
            {
              array_push($SuccessList,true);
            }
            else
            {
              array_push($SuccessList,false);
            }
          }
          else
          {
              array_push($SuccessList,false);
          }
      } 
      echo json_encode($SuccessList);
    }
   }
}
?>