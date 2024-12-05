<?php
    session_start();
    if (array_key_exists('IS_AUTH', $_SESSION)) {
        header('Location: index.php');
        die();
    }
?>
<meta charset="utf-8"/>
<form action="login.php" method="POST">
    Логин:<br><input name="login"><br>
    Пароль:<br><input name="password" type="password"><br>
    <input type="submit" value="Ок">
</form>

<style> 
	:root {
	    --width-form: 450px;
		--color-main: rgb(213 213 245);
	}
	
	form {
		width: var(--width-form);
		border: 2px solid gray;
		border-radius: 10px;
		padding: 10px;
		box-shadow: 5px 5px 5px lightgray;
		position: absolute;
		top: calc(50% - 55px);
		left: calc(50% - var(--width-form) / 2);
		font-size: 30px;
		background-color: var(--color-main);
	}
	form input {
		margin-top: 10px;
		font-size: 30px;
	}
</style>