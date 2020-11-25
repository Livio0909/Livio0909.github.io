<?php


require_once ('connection.php');
require_once ('function.php');
    $queryBaiHat = 'SELECT BaiHatID, TenBaiHat FROM baihat';

    try{
        $stmt = $dbCon->prepare($queryBaiHat);
        $stmt->execute();
    }
    catch(PDOException $ex){
        die(json_encode(array('status' => false, 'message' => $ex->getMessage())));
    }

    $data = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC))

    {
        // $queryCasi = "SELECT CaSiID FROM casihatbaihat WHERE BaiHatID ='". $row["BaiHatID"] . "'";
        // try{
        //     $stmt2 = $dbCon->prepare($queryCasi);
        //     $stmt2->execute();
        // }
        // catch(PDOException $ex){
        //     die(json_encode(array('status' => false, 'message' => $ex->getMessage())));
        // }
        // $casi = array();
        // while ($tenCasi = $stmt2->fetch(PDO::FETCH_ASSOC)){
        //     $casi[] = $tenCasi
        // }
        
        // $row['TenCaSi'] = $tenCasi['TenCaSi'];
        $artists = getSongArtist($row['BaiHatID'], $dbCon);
        foreach ($artists as $artist){
            $artistName = getArtistName($artist, $dbCon);
            $row['CaSi'][] = array('CaSiID' => $artist, 'TenCaSi' => $artistName);
        }
        $data[] =  $row ;
    }

    echo json_encode(array('status' => true, 'data' => $data, 'message' => 'Load success'), JSON_UNESCAPED_UNICODE );


?>