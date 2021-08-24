<?php
   include "page_functions.php";
   header('Content-Type: application/json');
   $Result = array("success" => true,"error" => null);
   if(isset($_COOKIE["token"]) && isset($_COOKIE["user_id"]))
   {
       if(!VerifyToken($_COOKIE["user_id"],$_COOKIE["token"]))
       {
           $Result["success"] = false;
           $Result["error"] = "Invalid User ID";
       }
   }
   else
   {
     $Result["success"] = false;
     $Result["error"] = "Invalid User Data";
   }
   echo json_encode($Result);
?>