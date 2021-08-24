<?php
  include "../server/page_classes.php";
  include "../server/page_variables.php";
  include "../server/page_functions.php";
  if(isset($_POST["email"]) && isset($_POST["password"]))
  {
  $DbCon = mysqli_connect(DB_HOST,DB_USER,DB_PASSWORD,DB_DATABASE,DB_PORT);
  $SQl = sprintf("SELECT ID,USERNAME,PASS_WORD FROM USERS WHERE BINARY EMAIL_ID = '%s'",$_POST["email"]);
  header('Content-Type: application/json');
  if($DbCon)
  {
  $Response = array("success" => true , "error" => null);
  if($result = $DbCon->query($SQl))
  {
      if($result->num_rows > 0)
      {
        $userData = $result->fetch_array();
        if(!password_verify($_POST["password"],$userData["PASS_WORD"]))
        {
            $Response["success"] = false;
            $Response["error"] = "password didn't matched";
        }
        else
        {
           setcookie("user_name",$userData["USERNAME"],0,"/Greenpen");
           setcookie("user_id",$userData["ID"],0,"/Greenpen");
           setcookie("token",GenerateToken($userData["ID"]),0,"/Greenpen","",false,true);
        }
      }
      else
      {
          $Response["success"] = false;
          $Response["error"] = "User not found";
      }
      echo json_encode($Response);
  }
 }
}
?>