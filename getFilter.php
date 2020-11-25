<?php


require_once('connection.php');
require_once('function.php');
if (isset($_GET)) {
    if (isset($_GET['filter'])) {
        $query = 'SELECT BaiHatID FROM baihat WHERE TenBaiHat like \'%' . $_GET['filter'] . '%\'';
        try {
            $stmt = $dbCon->prepare($query);
            $stmt->execute();
        } catch (PDOException $ex) {
            die(json_encode(array('status' => false, 'message' => $ex->getMessage())));
        }
        $listID = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

            $listID[] =  "'".$row['BaiHatID']."'";
        }
        $data = getListSongByID($listID,$dbCon);
        echo json_encode(array('status' => true, 'data' => $data, 'message' => 'Load success'), JSON_UNESCAPED_UNICODE );
    } else
        die(json_encode(array('status' => false, 'message' => 'invalid params')));
}
