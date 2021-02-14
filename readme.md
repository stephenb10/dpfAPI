/photos
GET 
Response:
Status 200 ok
```JSON 
{
    0: "UUIDfilename.jpg"
    1: "UUIDfilename.jpg"
    2: "UUIDfilename.jpg"
    ...
}
```

POST
Request:
```JSON 
{
    data: base64Data
}
```

Response:
Status 201 Created (400 if no body in req)
```JSON 
{
    photoID: "UUIDfilename.jpg"
}
```

/photos/:photoID
GET
Response:
Status 200 ok
return image data


DELETE
Response:
Status 204 no content