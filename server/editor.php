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
            case "SAVE_PROJECT":
                    if(isset($_GET["PROJECT_JSON"]))
                    {
                        print_r($_COOKIE);
                    }
                break;
        }
      }
    }
  }
?>