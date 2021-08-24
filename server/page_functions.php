<?php
    function GenerateToken($ID)
    {
        return password_hash($ID,PASSWORD_DEFAULT);
    }
    function VerifyToken($ID,$Token)
    {
        return password_verify($ID,$Token);
    }
    function GetAllFilesData($path)
    {
        $AllFiles = glob($path."/*");
        $JsonFileLIst = [basename($path)];
        foreach($AllFiles as $File)
        {
            if(!is_dir($File))
            {
                array_push($JsonFileLIst,basename($File));
            }
            else
            {
                array_push($JsonFileLIst,GetAllFilesData($File));
            }
        }
        return $JsonFileLIst;
    }
?>