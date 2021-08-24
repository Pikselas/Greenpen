<?php
  class _ACTIVE_USER
  {
        private $USER_EMAIL;
        function __construct($EMAIL)
        {
            $this->USER_EMAIL = $EMAIL;
        }
        public function UserEmail()
        {
            return $this->USER_EMAIL;
        }
  }  
?>