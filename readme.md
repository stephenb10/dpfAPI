# Digital Photo Frame API

## Get current photos

`GET https://host:3000/photos`


Returns `200 OK`
```JSON 
{
    "photos" : ["UUIDfilename1.jpg", "UUIDfilename2.jpg", "UUIDfilename3.jpg"]
}
```
## Add a new photo

`POST https://host:3000/photos`

The request requires the image to be encoded with base64
```JSON 
{
    "photoData" : "base64Data"
}
```

Returns `201 Created`
and the ID of the photo
```JSON 
{
    "photoID" : "UUIDfilename.jpg"
}
```

## Get a photo

`GET https://host:3000/photos/UUIDfilename1.jpg`

Returns `200 OK` 

## Delete a photo

`DELETE https://host:3000/photos/UUIDfilename1.jpg`

Returns `204 No Content`
