<?php
   include "../server/page_classes.php";
   include "../server/page_variables.php";
   include "../server/page_functions.php";
   if(isset($_POST["email"]) && isset($_POST["password"]) && isset($_POST["username"]))
   {
   $DbCon = mysqli_connect(DB_HOST,DB_USER,DB_PASSWORD,DB_DATABASE,DB_PORT);
   if($DbCon)
   {
        $salt =  password_hash($_POST["password"],PASSWORD_DEFAULT);
        $SQl = sprintf("INSERT INTO USERS(EMAIL_ID,PASS_WORD,USERNAME) VALUES('%s','%s','%s')",$_POST["email"],$salt,$_POST["username"]);
        header('Content-Type: application/json');
        $Response = array("success" => true , "error" => null);
        if(!$DbCon->query($SQl))
        {
           $Response["success"] = false;
           $Response["error"] = mysqli_errno($DbCon);
        }
        else 
        {
           $ID = $DbCon->query("SELECT LAST_INSERT_ID() AS ID")->fetch_assoc()["ID"];
           setcookie("user_name",$_POST["username"],0,"/Greenpen");
           setcookie("user_id",$ID,0,"/Greenpen");
           setcookie("token",GenerateToken($ID),0,"/Greenpen","",false,true);
           mkdir(USER_FOLDER . strval($ID));  
        }
        echo json_encode($Response);
   }
  }
?>