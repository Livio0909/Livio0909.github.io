<?php
require_once('connection.php');

    function getArtistName($artistID, $dbCon){
        $query = "SELECT TenCaSi FROM casi WHERE CaSiID='".$artistID."'";
        try{
            $stmt = $dbCon->prepare($query);
            $stmt->execute();
        }
        catch(PDOException $ex){
            die(json_encode(array('status' => false, 'message' => $ex->getMessage())));
        }
        $name = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $name['TenCaSi'];
    }

    
    function getArtistBySongID($songID, $dbCon){
        $query = "SELECT CaSiID FROM casihatbaihat WHERE BaiHatID='".$songID."'";
        try{
            $stmt = $dbCon->prepare($query);
            $stmt->execute();
        }
        catch(PDOException $ex){
            die(json_encode(array('status' => false, 'message' => $ex->getMessage())));
        }
        $data = array();
        while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            $data[] = $row['CaSiID'];
        }
        return $data;
    }

    function getSongByID($songID, $dbCon){
        $query = "SELECT * FROM baihat WHERE BaiHatID='".$songID."'";
        try{
            $stmt = $dbCon->prepare($query);
            $stmt->execute();
        }
        catch(PDOException $ex){
            die(json_encode(array('status' => false, 'message' => $ex->getMessage())));
        }
        $song = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $song;
    }

    function getArtistByID($artistID, $dbCon){
        $query = "SELECT * FROM casi WHERE CaSiID='".$artistID."'";
        try{
            $stmt = $dbCon->prepare($query);
            $stmt->execute();
        }
        catch(PDOException $ex){
            die(json_encode(array('status' => false, 'message' => $ex->getMessage())));
        }
        $artist = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $artist;
    }

    function getAllListSong($dbCon){
        $queryBaiHat = "SELECT * FROM baihat";

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
            $artists = getArtistBySongID($row['BaiHatID'], $dbCon);
            foreach ($artists as $artist){
                $artistName = getArtistName($artist, $dbCon);
                $row['CaSi'][] = array('CaSiID' => $artist, 'TenCaSi' => $artistName);
            }
            $data[] =  $row ;
        }
    
        return $data;
    }

    function getListSongByID($ID, $dbCon){
        $listOfID = implode(",",$ID);
        $queryBaiHat = "SELECT * FROM baihat WHERE BaiHatID  IN (".$listOfID.")";
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
        $artists = getArtistBySongID($row['BaiHatID'], $dbCon);
        foreach ($artists as $artist){
            $artistName = getArtistName($artist, $dbCon);
            $row['CaSi'][] = array('CaSiID' => $artist, 'TenCaSi' => $artistName);
        }
        $data[] =  $row ;
    }

    return $data;
    }
?>