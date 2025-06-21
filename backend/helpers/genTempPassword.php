<?php

function generatePassword($length = 9, $add_dashes = false, $available_sets = 'luds')
{
    $sets = [];
    if (strpos($available_sets, 'l') !== false)
        $sets[] = 'abcdefghjkmnpqrstuvwxyz';
    if (strpos($available_sets, 'u') !== false)
        $sets[] = 'ABCDEFGHJKMNPQRSTUVWXYZ';
    if (strpos($available_sets, 'd') !== false)
        $sets[] = '23456789';
    if (strpos($available_sets, 's') !== false)
        $sets[] = '!@#$%&*?';

    $all = '';
    $password = '';

    foreach ($sets as $set) {
        $password .= $set[random_secure_int(0, strlen($set) - 1)];
        $all .= $set;
    }

    $all = str_split($all);
    $remaining_length = $length - count($sets);
    for ($i = 0; $i < $remaining_length; $i++) {
        $password .= $all[random_secure_int(0, count($all) - 1)];
    }

    $password = secure_shuffle($password);

    if (!$add_dashes)
        return $password;

    $dash_len = floor(sqrt($length));
    $dash_str = '';
    while (strlen($password) > $dash_len) {
        $dash_str .= substr($password, 0, $dash_len) . '-';
        $password = substr($password, $dash_len);
    }
    $dash_str .= $password;

    return $dash_str;
}

function random_secure_int($min, $max)
{
    return random_int($min, $max);
}

function secure_shuffle($str)
{
    $array = str_split($str);
    $n = count($array);
    for ($i = $n - 1; $i > 0; $i--) {
        $j = random_secure_int(0, $i);
        [$array[$i], $array[$j]] = [$array[$j], $array[$i]];
    }
    return implode('', $array);
}
